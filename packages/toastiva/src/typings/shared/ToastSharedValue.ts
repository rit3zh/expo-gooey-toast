import type { SharedValue } from "react-native-reanimated";

interface IToastSharedValue {
  actionProgress: SharedValue<number>;
  bodyWidth: SharedValue<number>;
  bodyOpacity: SharedValue<number>;
  bodyRadius: SharedValue<number>;
  cornerSmoothing: SharedValue<number>;
  collapsedHeight: SharedValue<number>;
  descriptionProgress: SharedValue<number>;
  expandedHeight: SharedValue<number>;
  morphProgress: SharedValue<number>;
  mountProgress: SharedValue<number>;
  pillWidth: SharedValue<number>;
  progress: SharedValue<number>;
  removeProgress: SharedValue<number>;
  shakeX: SharedValue<number>;
  shellHeight: SharedValue<number>;
  squishX: SharedValue<number>;
  squishY: SharedValue<number>;
  stackOpacity: SharedValue<number>;
  stackContentOpacity: SharedValue<number>;
  stackScale: SharedValue<number>;
  stackY: SharedValue<number>;
  swipeX: SharedValue<number>;
  swipeY: SharedValue<number>;
}

export type { IToastSharedValue };
