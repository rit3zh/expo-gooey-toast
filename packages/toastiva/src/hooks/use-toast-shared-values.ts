import type { IToastSharedValue } from "../typings/shared/ToastSharedValue";
import { useMemo } from "react";
import { useSharedValue } from "react-native-reanimated";
import { DEFAULT_BODY_RADIUS, DEFAULT_CORNER_SMOOTHING, PH } from "../constants";

function useToastSharedValues(): IToastSharedValue {
  const actionProgress = useSharedValue<number>(0);
  const bodyWidth = useSharedValue<number>(PH);
  const bodyOpacity = useSharedValue<number>(0);
  const bodyRadius = useSharedValue<number>(DEFAULT_BODY_RADIUS);
  const cornerSmoothing = useSharedValue<number>(DEFAULT_CORNER_SMOOTHING);
  const collapsedHeight = useSharedValue<number>(PH);
  const descriptionProgress = useSharedValue<number>(0);
  const expandedHeight = useSharedValue<number>(PH);
  const morphProgress = useSharedValue<number>(0);
  const mountProgress = useSharedValue<number>(0);
  const pillWidth = useSharedValue<number>(PH);
  const progress = useSharedValue<number>(0);
  const removeProgress = useSharedValue<number>(0);
  const shakeX = useSharedValue<number>(0);
  const shellHeight = useSharedValue<number>(PH);
  const squishX = useSharedValue<number>(1);
  const squishY = useSharedValue<number>(1);
  const stackOpacity = useSharedValue<number>(1);
  const stackContentOpacity = useSharedValue<number>(1);
  const stackScale = useSharedValue<number>(1);
  const stackY = useSharedValue<number>(0);
  const swipeX = useSharedValue<number>(0);
  const swipeY = useSharedValue<number>(0);

  return useMemo<IToastSharedValue>(
    () => ({
      actionProgress,
      bodyWidth,
      bodyOpacity,
      bodyRadius,
      cornerSmoothing,
      collapsedHeight,
      descriptionProgress,
      expandedHeight,
      morphProgress,
      mountProgress,
      pillWidth,
      progress,
      removeProgress,
      shakeX,
      shellHeight,
      squishX,
      squishY,
      stackOpacity,
      stackContentOpacity,
      stackScale,
      stackY,
      swipeX,
      swipeY,
    }),
    [
      actionProgress,
      bodyWidth,
      bodyOpacity,
      bodyRadius,
      cornerSmoothing,
      collapsedHeight,
      descriptionProgress,
      expandedHeight,
      morphProgress,
      mountProgress,
      pillWidth,
      progress,
      removeProgress,
      shakeX,
      shellHeight,
      squishX,
      squishY,
      stackOpacity,
      stackContentOpacity,
      stackScale,
      stackY,
      swipeX,
      swipeY,
    ],
  );
}

export { useToastSharedValues };
