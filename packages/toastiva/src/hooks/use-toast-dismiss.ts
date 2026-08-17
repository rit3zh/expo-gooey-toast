import type { IUseToastDismissParams } from "../typings";
import { useCallback, useEffect, useRef, useState } from "react";
import { Easing, withDelay, withTiming } from "react-native-reanimated";
import { SHOW_BODY_DELAY } from "../constants";
import { getCollapseDuration, getDisplayDuration } from "../utils/toast-timing";

function useToastDismiss(params: IUseToastDismissParams) {
  const {
    expanded,
    animationConfig,
    hasBody,
    showBody,
    isExpandedCandidate,
    isFront,
    isVisible,
    onRemove,
    paused = false,
    shouldAutoExpand,
    toast,
    values,
  } = params;
  const [isDismissing, setIsDismissing] = useState(false);
  const dismissedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = useRef<number | null>(null);
  const timerStartRef = useRef(0);
  const expandedBodyVisibleRef = useRef(false);
  const collapseDuration = getCollapseDuration(toast);
  const displayDuration = getDisplayDuration(toast);

  useEffect(() => {
    dismissedRef.current = false;
    remainingRef.current = null;
    timerStartRef.current = 0;
    expandedBodyVisibleRef.current = false;
    setIsDismissing(false);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [toast.id]);

  useEffect(() => {
    expandedBodyVisibleRef.current =
      hasBody && showBody && !isDismissing && isExpandedCandidate;
  }, [hasBody, isDismissing, isExpandedCandidate, showBody]);

  const handleDismiss = useCallback(() => {
    if (paused) return;
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    const collapseBeforeExit = hasBody && expandedBodyVisibleRef.current;
    setIsDismissing(collapseBeforeExit);
    if (timerRef.current) clearTimeout(timerRef.current);

    const collapseShapeDuration = collapseBeforeExit
      ? getSmoothDismissCollapseDuration(animationConfig.morph.collapseDuration)
      : 100;
    const collapseContentDuration = collapseBeforeExit
      ? getSmoothDismissContentDuration(collapseShapeDuration)
      : 90;
    const collapseAnim = {
      duration: collapseShapeDuration,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    };

    values.morphProgress.value = withTiming(0, collapseAnim);
    values.bodyOpacity.value = withTiming(0, {
      duration: collapseContentDuration,
      easing: Easing.out(Easing.quad),
    });
    values.descriptionProgress.value = withTiming(0, {
      duration: collapseContentDuration,
      easing: Easing.out(Easing.cubic),
    });
    values.actionProgress.value = withTiming(0, {
      duration: collapseContentDuration,
      easing: Easing.out(Easing.cubic),
    });
    values.squishY.value = withTiming(1, collapseAnim);
    values.squishX.value = withTiming(1, collapseAnim);

    const exitDelay = collapseBeforeExit ? collapseShapeDuration + 40 : 40;
    values.removeProgress.value = withDelay(
      exitDelay,
      withTiming(1, { duration: 220, easing: Easing.in(Easing.quad) }),
    );
    toast.onDismiss?.();
    setTimeout(() => onRemove(toast.id), exitDelay + 280);
  }, [
    collapseDuration,
    animationConfig.morph.collapseDuration,
    hasBody,
    onRemove,
    paused,
    toast,
    values,
  ]);

  useEffect(() => {
    remainingRef.current = null;
  }, [displayDuration, toast.isLoading]);

  useEffect(() => {
    if (paused) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    if (toast.isLoading) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    // Don't gate on isVisible — toasts beyond visibleCount still need to
    // age out. Otherwise spammed toasts pile up in the back of the stack
    // forever, only starting their timer once they slide into view.
    if (hasBody && shouldAutoExpand && !showBody) return;

    const autoDismissDelay = hasBody && shouldAutoExpand
      ? Math.max(0, displayDuration - SHOW_BODY_DELAY - collapseDuration)
      : displayDuration;

    const delay = remainingRef.current ?? autoDismissDelay;
    timerStartRef.current = Date.now();

    timerRef.current = setTimeout(() => {
      remainingRef.current = null;
      toast.onAutoClose?.();
      handleDismiss();
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const elapsed = Date.now() - timerStartRef.current;
      const remaining = delay - elapsed;
      remainingRef.current = remaining > 0 ? remaining : null;
    };
  }, [
    collapseDuration,
    displayDuration,
    expanded,
    handleDismiss,
    hasBody,
    isFront,
    isVisible,
    paused,
    showBody,
    shouldAutoExpand,
    toast,
    toast.isLoading,
  ]);

  return { handleDismiss, isDismissing };
}

function getSmoothDismissCollapseDuration(duration: number) {
  return Math.max(260, duration);
}

function getSmoothDismissContentDuration(duration: number) {
  return Math.max(150, Math.round(duration * 0.62));
}

export { useToastDismiss };
