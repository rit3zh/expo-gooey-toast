import type { ValueOf } from "../../global-ts/value-of";
import type { Dispatch, SetStateAction } from "react";
import type {
  IToastivaConfig,
  IToastivaData,
  TToastivaVerticalPosition,
} from "../toast";

interface IToastStackProps {
  bottomInset: number;
  defaultAnimation: ValueOf<IToastivaConfig, "animation">;
  defaultAnimationPreset: ValueOf<IToastivaConfig, "animationPreset">;
  defaultBodyLayout: ValueOf<IToastivaConfig, "bodyLayout">;
  defaultBodyRadius: ValueOf<IToastivaConfig, "bodyRadius">;
  defaultCornerSmoothing: ValueOf<IToastivaConfig, "cornerSmoothing">;
  defaultDisableIOSBlur: ValueOf<IToastivaConfig, "disableIOSBlur">;
  defaultExpandedHeight: ValueOf<IToastivaConfig, "expandedHeight">;
  defaultExpandedWidth: ValueOf<IToastivaConfig, "expandedWidth">;
  defaultFill: ValueOf<IToastivaConfig, "fill">;
  defaultIOSBlurTint: ValueOf<IToastivaConfig, "iosBlurTint">;
  defaultSpringConfig: ValueOf<IToastivaConfig, "springConfig">;
  defaultStroke: ValueOf<IToastivaConfig, "stroke">;
  defaultStyles: ValueOf<IToastivaConfig, "styles">;
  expand: boolean;
  gap: number;
  heightMap: Map<string, number>;
  horizontalInset: number;
  offset: number;
  onHeightChange: (id: string, height: number) => void;
  onRemove: (id: string) => void;
  position: ValueOf<IToastivaConfig, "position">;
  setExpanded: Dispatch<SetStateAction<boolean>>;
  showProgress: boolean;
  showTimestamp: boolean;
  swipeThreshold: number;
  swipeToDismiss: boolean;
  toasts: IToastivaData[];
  topInset: number;
  vertical: TToastivaVerticalPosition;
  visibleToasts: number;
}

export type { IToastStackProps };
