import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { cancelAnimation } from "react-native-reanimated";
import {
  DEFAULT_BODY_RADIUS,
  DEFAULT_CORNER_SMOOTHING,
  PH,
  SHOW_BODY_DELAY,
} from "../constants";
import { useToastTheme } from "../context";
import { iconMap } from "../icons";
import type {
  IToastivaProps,
  TToastivaHorizontalAlign,
  TToastivaSpringConfig,
} from "../typings";
import { ToastivaBodyLayout, ToastivaHorizontalAlign } from "../typings";
import { getStackAlign } from "../utils/toast-align";
import { resolveToastAnimationConfig } from "../utils/toast-animation";
import { getToastHeights, getToastWidths } from "../utils/toast-layout";
import { getBodyLayout, getToastMeta } from "../utils/toast-meta";
import { useToastAnimatedStyles } from "./use-toast-animated-styles";
import { useToastDismiss } from "./use-toast-dismiss";
import { useToastEffects } from "./use-toast-effects";
import { useToastGesture } from "./use-toast-gesture";
import { useToastMeasurements } from "./use-toast-measurements";
import { useToastSharedValues } from "./use-toast-shared-values";

function getMorphAlign(
  bodyLayout: ReturnType<typeof getBodyLayout>,
  stackAlign: TToastivaHorizontalAlign,
) {
  if (bodyLayout === ToastivaBodyLayout.Left)
    return ToastivaHorizontalAlign.Left;
  if (bodyLayout === ToastivaBodyLayout.Center)
    return ToastivaHorizontalAlign.Center;
  if (bodyLayout === ToastivaBodyLayout.Right)
    return ToastivaHorizontalAlign.Right;
  return stackAlign;
}

function useToastCard(props: IToastivaProps) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const theme = useToastTheme();
  const hasBody = useMemo(
    () =>
      Boolean(
        props.toast.description || props.toast.action || props.toast.content,
      ),
    [props.toast.description, props.toast.action, props.toast.content],
  );
  const bodyLayout = useMemo(
    () => getBodyLayout(props.toast.bodyLayout ?? props.defaultBodyLayout),
    [props.toast.bodyLayout, props.defaultBodyLayout],
  );
  const meta = useMemo(
    () =>
      getToastMeta(
        props.toast,
        props.toast.showTimestamp ?? props.defaultShowTimestamp,
      ),
    [props.toast, props.defaultShowTimestamp],
  );
  const showProgress = props.toast.showProgress ?? props.defaultShowProgress;
  const bodyRadius =
    props.toast.bodyRadius ?? props.defaultBodyRadius ?? DEFAULT_BODY_RADIUS;
  // 0 = plain circular corners, 1 = full squircle. Reads `cornerSmoothing` off
  // the toast (per-toast) or `defaultCornerSmoothing` off the provider, falling
  // back to the package default. Cast defensively so this compiles ahead of the
  // public prop-type additions documented in the changelog.
  const cornerSmoothing =
    (props.toast as { cornerSmoothing?: number }).cornerSmoothing ??
    (props as { defaultCornerSmoothing?: number }).defaultCornerSmoothing ??
    DEFAULT_CORNER_SMOOTHING;
  const styleOverrides = useMemo(
    () => ({
      ...props.defaultStyles,
      ...props.toast.styles,
    }),
    [props.defaultStyles, props.toast.styles],
  );
  const headerMeasureKey = [
    props.toast.type,
    props.toast.title,
    props.toast.icon ? "custom-icon" : "status-icon",
    props.toast.showIcon ?? true,
    props.toast.showIconBadge ?? true,
    bodyRadius,
  ].join(":");
  const isFront = props.index === 0;
  const isVisible = props.index < props.visibleCount;
  const isTop = props.position.startsWith("top");
  const allowFrontExpansionRef = useRef(isFront);
  const frontSettleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [frontSettled, setFrontSettled] = useState(props.totalCount <= 1);
  const shouldAutoExpand =
    !props.forceCollapsed &&
    isFront &&
    allowFrontExpansionRef.current &&
    (props.totalCount <= 1 || frontSettled);
  const showBodyDelay = props.morphMode ? MORPH_BODY_DELAY : SHOW_BODY_DELAY;
  const [showBody, setShowBody] = useState(false);
  const [renderBody, setRenderBody] = useState(false);
  // Mirror body visibility into refs so timers/effects can make decisions
  // without adding state values that would restart the collapse timer.
  const showBodyRef = useRef(showBody);
  const renderBodyRef = useRef(renderBody);
  const toastIdRef = useRef(props.toast.id);
  const isNewToast = toastIdRef.current !== props.toast.id;
  const effectiveShowBody = isNewToast ? false : showBody;
  const effectiveRenderBody = isNewToast ? false : renderBody;
  showBodyRef.current = effectiveShowBody;
  renderBodyRef.current = effectiveRenderBody;
  const showBodyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bodyUnmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const shouldLayoutExpandedContent =
    hasBody && (props.expanded || shouldAutoExpand || effectiveRenderBody);
  const cardMeasureKey = [
    headerMeasureKey,
    shouldLayoutExpandedContent ? (props.toast.description ?? "") : "",
    shouldLayoutExpandedContent ? (props.toast.action?.label ?? "") : "",
    shouldLayoutExpandedContent ? (meta ?? "") : "",
    shouldLayoutExpandedContent
      ? props.toast.content
        ? "has-content"
        : ""
      : "",
    bodyLayout,
    shouldLayoutExpandedContent,
    width,
    props.toast.expandedWidth ?? props.defaultExpandedWidth ?? 0,
    props.toast.expandedHeight ?? props.defaultExpandedHeight ?? 0,
    props.toast.horizontalInset ?? props.defaultHorizontalInset,
    bodyRadius,
  ].join("|");
  const values = useToastSharedValues();
  useEffect(() => {
    values.cornerSmoothing.value = cornerSmoothing;
  }, [cornerSmoothing, values]);
  const measure = useToastMeasurements(
    headerMeasureKey,
    cardMeasureKey,
    props.toast.id,
    props.onHeightChange,
  );
  const animationConfig = useMemo(
    () =>
      resolveToastAnimationConfig({
        animation: {
          ...props.defaultAnimation,
          ...props.toast.animation,
          compact: {
            ...props.defaultAnimation?.compact,
            ...props.toast.animation?.compact,
          },
          morph: {
            ...props.defaultAnimation?.morph,
            ...props.toast.animation?.morph,
          },
          mount: {
            ...props.defaultAnimation?.mount,
            ...props.toast.animation?.mount,
          },
          springs: {
            ...props.defaultAnimation?.springs,
            ...props.toast.animation?.springs,
          },
          stack: {
            ...props.defaultAnimation?.stack,
            ...props.toast.animation?.stack,
          },
        },
        animationPreset:
          props.toast.animationPreset ?? props.defaultAnimationPreset,
        springConfig: {
          ...props.defaultSpringConfig,
          ...props.toast.springConfig,
        } as TToastivaSpringConfig,
      }),
    [
      props.defaultAnimation,
      props.defaultAnimationPreset,
      props.defaultSpringConfig,
      props.toast.animation,
      props.toast.animationPreset,
      props.toast.springConfig,
    ],
  );
  const springConfig = animationConfig.springs;
  const isReadyToExpand =
    shouldLayoutExpandedContent && (measure.isCardHeightCurrent || isWeb);
  useLayoutEffect(() => {
    if (toastIdRef.current === props.toast.id) return;
    toastIdRef.current = props.toast.id;
    if (showBodyTimerRef.current) {
      clearTimeout(showBodyTimerRef.current);
      showBodyTimerRef.current = null;
    }
    if (bodyUnmountTimerRef.current) {
      clearTimeout(bodyUnmountTimerRef.current);
      bodyUnmountTimerRef.current = null;
    }
    setShowBody(false);
    setRenderBody(false);
    // Reset swipe and exit animations so the incoming toast doesn't inherit
    // the exiting toast's off-screen position or opacity state.
    cancelAnimation(values.swipeX);
    cancelAnimation(values.swipeY);
    cancelAnimation(values.removeProgress);
    values.swipeX.value = 0;
    values.swipeY.value = 0;
    values.removeProgress.value = 0;
  }, [props.toast.id, values]);

  useEffect(() => {
    if (!isFront) allowFrontExpansionRef.current = false;
  }, [isFront]);

  useEffect(() => {
    if (frontSettleTimerRef.current) {
      clearTimeout(frontSettleTimerRef.current);
      frontSettleTimerRef.current = null;
    }
    if (!isFront) {
      setFrontSettled(false);
      return;
    }
    if (props.totalCount <= 1) {
      setFrontSettled(true);
      return;
    }
    setFrontSettled(false);
    frontSettleTimerRef.current = setTimeout(() => {
      frontSettleTimerRef.current = null;
      setFrontSettled(true);
    }, STACKED_FRONT_REVEAL_DELAY);
    return () => {
      if (frontSettleTimerRef.current) {
        clearTimeout(frontSettleTimerRef.current);
      }
    };
  }, [isFront, props.toast.id, props.totalCount]);

  const shouldRevealBody =
    isReadyToExpand && (props.expanded || shouldAutoExpand);

  // When content updates (e.g. promise resolves with new description) the
  // card key changes and measurements go stale for a frame or two.  We must
  // NOT hide the body during this window or we trigger a visible
  // collapse → re-expand flash.
  const isRemeasuringWithVisibleBody =
    effectiveShowBody &&
    shouldLayoutExpandedContent &&
    !measure.isCardHeightCurrent &&
    (props.expanded || shouldAutoExpand);

  useEffect(() => {
    if (showBodyTimerRef.current) {
      clearTimeout(showBodyTimerRef.current);
      showBodyTimerRef.current = null;
    }
    if (bodyUnmountTimerRef.current) {
      clearTimeout(bodyUnmountTimerRef.current);
      bodyUnmountTimerRef.current = null;
    }
    // Keep body shown while measurements are catching up to updated content.
    if (isRemeasuringWithVisibleBody) return;
    if (!shouldRevealBody) {
      setShowBody(false);
      if (showBodyRef.current || renderBodyRef.current) {
        bodyUnmountTimerRef.current = setTimeout(() => {
          bodyUnmountTimerRef.current = null;
          setRenderBody(false);
        }, COLLAPSE_BODY_UNMOUNT_DELAY);
      } else {
        setRenderBody(false);
      }
      return () => {
        if (bodyUnmountTimerRef.current) {
          clearTimeout(bodyUnmountTimerRef.current);
          bodyUnmountTimerRef.current = null;
        }
      };
    }
    setRenderBody(true);
    // Body is already visible — skip the expand delay and avoid a redundant
    // setState call (e.g. when only heights change after a content update).
    if (showBodyRef.current) return;
    showBodyTimerRef.current = setTimeout(() => {
      showBodyTimerRef.current = null;
      setShowBody(true);
    }, showBodyDelay);
    return () => {
      if (showBodyTimerRef.current) clearTimeout(showBodyTimerRef.current);
      if (bodyUnmountTimerRef.current) {
        clearTimeout(bodyUnmountTimerRef.current);
      }
    };
  }, [shouldRevealBody, isRemeasuringWithVisibleBody, showBodyDelay]);

  const measuredPillWidth = measure.isPillWidthCurrent
    ? measure.measuredPillWidth
    : 0;

  const widths = useMemo(
    () =>
      getToastWidths({
        title: props.toast.title,
        hasBody: shouldLayoutExpandedContent,
        screenWidth: width,
        measuredPillWidth,
        expandedWidth: props.toast.expandedWidth ?? props.defaultExpandedWidth,
        horizontalInset:
          props.toast.horizontalInset ?? props.defaultHorizontalInset,
      }),
    [
      props.toast.title,
      shouldLayoutExpandedContent,
      width,
      measuredPillWidth,
      props.toast.expandedWidth,
      props.defaultExpandedWidth,
      props.toast.horizontalInset,
      props.defaultHorizontalInset,
      bodyRadius,
    ],
  );
  const heights = useMemo(
    () =>
      getToastHeights({
        actionLabel: props.toast.action?.label,
        bodyLayout,
        bodyWidth: widths.bodyWidth,
        description: props.toast.description,
        expandedHeightOverride:
          props.toast.expandedHeight ?? props.defaultExpandedHeight,
        frontHeight: props.frontHeight,
        hasCustomContent: Boolean(props.toast.content),
        isFront,
        measuredHeight: measure.measuredHeight,
        meta,
        showProgress: Boolean(!props.toast.isLoading && showProgress),
      }),
    [
      bodyLayout,
      widths.bodyWidth,
      measure.measuredHeight,
      props.frontHeight,
      isFront,
      props.toast.action?.label,
      props.toast.content,
      props.toast.description,
      props.toast.expandedHeight,
      props.toast.isLoading,
      props.defaultExpandedHeight,
      meta,
      showProgress,
    ],
  );
  const dismiss = useToastDismiss({
    toast: props.toast,
    animationConfig,
    expanded: props.expanded,
    hasBody,
    showBody: effectiveShowBody,
    isFront,
    isVisible,
    isExpandedCandidate: props.expanded || shouldAutoExpand,
    onRemove: props.onRemove,
    paused: props.dismissPaused,
    shouldAutoExpand,
    springConfig,
    values,
  });
  const showExpandedBody =
    effectiveShowBody &&
    !dismiss.isDismissing &&
    (props.expanded || shouldAutoExpand);
  const positionAlign = getStackAlign(props.position);
  const morphAlign = getMorphAlign(bodyLayout, positionAlign);
  const stackAlign = positionAlign;
  const headerAlign = morphAlign;
  const noHeader =
    Boolean(props.toast.content) && props.toast.showHeader === false;
  // noHeader entrance: keep width fixed at bodyWidth (no horizontal morph) and
  // animate height from PH (thin pill bar) to expandedHeight via morphProgress.
  // The path renders a rounded rectangle that grows in height — no pill bump,
  // no width pop, just a clean expand-down reveal of the user's content.
  const effectivePillWidth = noHeader ? widths.bodyWidth : widths.pillWidth;
  const effectiveCollapsedHeight = noHeader
    ? PH
    : heights.collapsedCardHeight;
  const animated = useToastAnimatedStyles({
    animationConfig,
    bodyWidth: widths.bodyWidth,
    bodyRadius,
    collapsedHeight: effectiveCollapsedHeight,
    expanded: props.expanded,
    expandedHeight: heights.expandedHeight,
    index: props.index,
    morphAlign,
    isFront,
    isTop,
    noHeader,
    pillWidth: effectivePillWidth,
    renderHeight: heights.renderHeight,
    totalCount: props.totalCount,
    values,
  });

  useToastEffects({
    animationConfig,
    bodyWidth: widths.bodyWidth,
    bodyRadius,
    toast: props.toast,
    expanded: props.expanded,
    expandedOffset: props.expandedOffset,
    collapsedOffset: props.collapsedOffset,
    expandedHeight: heights.expandedHeight,
    collapsedCardHeight: effectiveCollapsedHeight,
    hasBody,
    isFront,
    isMeasured: noHeader
      ? measure.isCardHeightCurrent || isWeb
      : measure.isPillWidthCurrent || isWeb,
    isTop,
    isDismissing: dismiss.isDismissing,
    morphMode: props.morphMode,
    pillWidth: effectivePillWidth,
    springConfig,
    shouldAutoExpand,
    shouldShowExpandedBody: showExpandedBody,
    stackDepth: Math.min(props.index, props.visibleCount - 1),
    values,
  });

  return {
    Icon: iconMap[props.toast.type],
    animated,
    bodyLayout,
    color: theme.colors[props.toast.type],
    disableIOSBlur:
      props.toast.disableIOSBlur ?? props.defaultDisableIOSBlur ?? false,
    dismiss,
    gesture: useToastGesture({
      isTop,
      swipeToDismiss: props.swipeToDismiss,
      dismissible: props.toast.dismissible,
      swipeThreshold: props.swipeThreshold,
      onDismiss: dismiss.handleDismiss,
      values,
    }),
    hasBody,
    headerAlign,
    heights,
    isFront,
    morphAlign,
    isTop,
    iosBlurTint: props.toast.iosBlurTint ?? props.defaultIOSBlurTint,
    isVisible,
    measure,
    measureBody: shouldLayoutExpandedContent,
    meta,
    noHeader,
    stackAlign,
    showBody: effectiveRenderBody,
    showProgress,
    stroke:
      props.toast.stroke ??
      props.defaultStroke ??
      theme.surfaceStrokeColors[props.toast.type],
    styleOverrides,
    surfaceFill:
      props.toast.fill ??
      props.defaultFill ??
      theme.surfaceColors[props.toast.type],
    widths,
  };
}

const COLLAPSE_BODY_UNMOUNT_DELAY = 320;
const MORPH_BODY_DELAY = 120;
const STACKED_FRONT_REVEAL_DELAY = SHOW_BODY_DELAY + 220;

export { useToastCard };
