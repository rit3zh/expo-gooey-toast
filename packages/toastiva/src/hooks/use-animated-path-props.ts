import { useAnimatedProps } from "react-native-reanimated";
import { morphPath, morphPathCenter, morphPathRight } from "../morph";
import { IUseToastAnimatedStylesParams } from "../typings";

const useAnimatedPathProps = <T extends IUseToastAnimatedStylesParams>(
  params: T,
) => {
  const { values, morphAlign, bodyWidth, noHeader = false } = params;

  return useAnimatedProps(() => {
    const progress = values.morphProgress.value;
    const t = progress < 0 ? 0 : progress > 1 ? 1 : progress;

    const pillWidth = values.pillWidth.value;
    const bodyW = values.bodyWidth.value;
    const expandedHeight = values.expandedHeight.value;
    const bodyRadius = values.bodyRadius.value;
    const smoothing = values.cornerSmoothing.value;

    if (morphAlign === "center") {
      return {
        d: morphPathCenter(
          pillWidth,
          bodyW,
          expandedHeight,
          t,
          bodyWidth,
          bodyRadius,
          noHeader,
          smoothing,
        ),
      };
    }

    if (morphAlign === "right") {
      return {
        d: morphPathRight(
          pillWidth,
          bodyW,
          expandedHeight,
          t,
          bodyWidth,
          bodyRadius,
          noHeader,
          smoothing,
        ),
      };
    }

    return {
      d: morphPath(
        pillWidth,
        bodyW,
        expandedHeight,
        t,
        bodyWidth,
        bodyRadius,
        noHeader,
      ),
    };
  }, [noHeader]);
};

export { useAnimatedPathProps };
