import type { BlurViewProps } from "expo-blur";
import { Platform } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { HEADER_BLUR_INTENSITY } from "../utils/toast-header-animation";

const USE_FILTER_BLUR = Platform.OS === "android" || Platform.OS === "web";
const HEADER_LAYER_MAX_BLUR_PX = 2.5;

function useToastHeaderAnimatedStyles(
  currentTitleProgress: SharedValue<number>,
  prevTitleProgress: SharedValue<number>,
) {
  const currentHeaderStyle = useAnimatedStyle(() => {
    const progress = currentTitleProgress.value;
    const opacity = interpolate(progress, [0, 1], [0, 1], Extrapolation.CLAMP);
    if (!USE_FILTER_BLUR) return { opacity };
    return {
      opacity,
      filter: [
        {
          blur: withSpring(
            interpolate(
              progress,
              [0, 1],
              [HEADER_LAYER_MAX_BLUR_PX, 0],
              Extrapolation.CLAMP,
            ),
          ),
        },
      ],
    };
  }, []);

  const prevHeaderStyle = useAnimatedStyle(() => {
    const progress = prevTitleProgress.value;
    const opacity = interpolate(progress, [0, 1], [1, 0], Extrapolation.CLAMP);
    if (!USE_FILTER_BLUR) return { opacity };
    return {
      opacity,
      filter: [
        {
          blur: withSpring(
            interpolate(
              progress,
              [0, 1],
              [0, HEADER_LAYER_MAX_BLUR_PX],
              Extrapolation.CLAMP,
            ),
          ),
        },
      ],
    };
  }, []);

  const animatedBlurProps = useAnimatedProps<
    Required<Pick<BlurViewProps, "intensity">>
  >(
    () => ({
      intensity: withSpring(
        interpolate(
          currentTitleProgress.value,
          [0, 0.5, 1],
          [0, HEADER_BLUR_INTENSITY, 0],
          Extrapolation.CLAMP,
        ),
      ),
    }),
    [],
  );

  const animatedFilterStyle = useAnimatedStyle(() => ({}), []);

  return {
    animatedBlurProps,
    animatedFilterStyle,
    currentHeaderStyle,
    prevHeaderStyle,
  };
}

export { useToastHeaderAnimatedStyles };
