import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";
import {
  cancelAnimation,
  Easing,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN, scheduleOnUI } from "react-native-worklets";
import type { IUseToastHeaderMorphParams } from "../typings";
import {
  createHeaderLayer,
  HEADER_LAYER_CLEAR_MS,
  HEADER_TITLE_EXIT_MS,
  HEADER_TITLE_MORPH_MS,
} from "../utils/toast-header-animation";
import { useToastHeaderAnimatedStyles } from "./use-toast-header-animated-styles";

function useToastHeaderMorph(params: IUseToastHeaderMorphParams) {
  const {
    color,
    headerContent,
    Icon,
    icon,
    measure,
    showIcon,
    showIconBadge,
    title,
    type,
  } = params;
  const headerKey = `${type}:${title}:${headerContent ? "custom" : "default"}`;
  const [headerLayer, setHeaderLayer] = useState(() => ({
    current: createHeaderLayer({
      color,
      headerContent,
      Icon,
      icon,
      showIcon,
      showIconBadge,
      title,
      type,
    }),
    prev: null as ReturnType<typeof createHeaderLayer> | null,
  }));
  const prevHeaderKeyRef = useRef(headerKey);
  const prevClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleMorphFrameRef = useRef<number | null>(null);
  const isMorphingRef = useRef(false);
  const morphVersionRef = useRef(0);
  const currentTitleProgress = useSharedValue(1);
  const prevTitleProgress = useSharedValue(1);
  const animatedStyles = useToastHeaderAnimatedStyles(
    currentTitleProgress,
    prevTitleProgress,
  );

  const clearPrevLayer = useCallback(
    (version?: Required<number>): void | any => {
      if (version !== undefined && version !== morphVersionRef.current) return;
      if (prevClearTimerRef.current) {
        clearTimeout(prevClearTimerRef.current);
        prevClearTimerRef.current = null;
      }
      isMorphingRef.current = false;
      setHeaderLayer((state) =>
        state.prev ? { ...state, prev: null } : state,
      );
    },
    [],
  );

  const scheduleClear = useCallback(
    (version: number) => {
      if (prevClearTimerRef.current) clearTimeout(prevClearTimerRef.current);
      prevClearTimerRef.current = setTimeout(() => {
        clearPrevLayer(version);
      }, HEADER_LAYER_CLEAR_MS);
    },
    [clearPrevLayer],
  );

  useLayoutEffect(() => {
    const nextHeaderLayer = createHeaderLayer({
      color,
      headerContent,
      Icon,
      icon,
      showIcon,
      showIconBadge,
      title,
      type,
    });

    if (measure) {
      morphVersionRef.current += 1;
      prevHeaderKeyRef.current = headerKey;
      cancelAnimation(currentTitleProgress);
      cancelAnimation(prevTitleProgress);
      if (titleMorphFrameRef.current !== null) {
        cancelAnimationFrame(titleMorphFrameRef.current);
        titleMorphFrameRef.current = null;
      }
      currentTitleProgress.value = 1;
      prevTitleProgress.value = 1;
      isMorphingRef.current = false;
      if (prevClearTimerRef.current) {
        clearTimeout(prevClearTimerRef.current);
        prevClearTimerRef.current = null;
      }
      setHeaderLayer({ current: nextHeaderLayer, prev: null });
      return;
    }

    if (prevHeaderKeyRef.current === headerKey) {
      setHeaderLayer((state) => ({ ...state, current: nextHeaderLayer }));
      return;
    }

    prevHeaderKeyRef.current = headerKey;
    cancelAnimation(currentTitleProgress);
    cancelAnimation(prevTitleProgress);
    if (titleMorphFrameRef.current !== null) {
      cancelAnimationFrame(titleMorphFrameRef.current);
      titleMorphFrameRef.current = null;
    }
    const wasMorphing = isMorphingRef.current;
    const exitingStartProgress = wasMorphing ? currentTitleProgress.value : 0;
    const morphVersion = morphVersionRef.current + 1;
    morphVersionRef.current = morphVersion;
    isMorphingRef.current = true;

    // On Android, write the initial shared values directly on the UI thread
    // via runOnUI so they land during the Choreographer animation phase —
    // which is guaranteed to run before the traversal/draw phase that paints
    // the new header content. Without this, the JS-thread → UI-thread write of
    // `value = 0` races with React's commit: the new title can be drawn for
    // one frame at the old opacity (1) before the value reaches the UI thread,
    // producing a visible flash. iOS doesn't need this because CoreAnimation
    // batches all layer changes into the same transaction as the React commit.
    if (Platform.OS === "android") {
      scheduleOnUI(() => {
        "worklet";
        currentTitleProgress.value = 0;
        prevTitleProgress.value = exitingStartProgress;
      });
    } else {
      currentTitleProgress.value = 0;
      prevTitleProgress.value = exitingStartProgress;
    }

    setHeaderLayer((state) => ({
      current: nextHeaderLayer,
      prev: state.current,
    }));

    const startTitleMorph = () => {
      titleMorphFrameRef.current = null;
      if (morphVersionRef.current !== morphVersion) return;
      currentTitleProgress.value = withTiming(1, {
        duration: HEADER_TITLE_MORPH_MS,
        easing: Easing.out(Easing.cubic),
      });
      prevTitleProgress.value = withTiming(
        1,
        {
          duration: HEADER_TITLE_EXIT_MS,
          easing: Easing.out(Easing.cubic),
        },
        (finished) => {
          if (finished) scheduleOnRN(clearPrevLayer, morphVersion);
        },
      );
    };

    if (Platform.OS === "android") {
      titleMorphFrameRef.current = requestAnimationFrame(startTitleMorph);
    } else {
      startTitleMorph();
    }
    scheduleClear(morphVersion);
  }, [
    headerKey,
    color,
    Icon,
    icon,
    headerContent,
    measure,
    showIcon,
    showIconBadge,
    title,
    type,
    currentTitleProgress,
    prevTitleProgress,
    clearPrevLayer,
    scheduleClear,
  ]);

  useEffect(() => {
    return () => {
      if (prevClearTimerRef.current) clearTimeout(prevClearTimerRef.current);
      if (titleMorphFrameRef.current !== null) {
        cancelAnimationFrame(titleMorphFrameRef.current);
      }
    };
  }, []);

  return {
    ...animatedStyles,
    headerLayer,
  };
}

export { useToastHeaderMorph };
