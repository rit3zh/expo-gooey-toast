import type { ValueOf } from "../../global-ts/value-of";
import type {
  IToastivaConfig,
  IToastivaData,
  TToastivaBodyLayout,
  TToastivaPosition,
} from "../toast";

interface IToastivaProps {
  collapsedOffset: number;
  defaultAnimation?: ValueOf<IToastivaConfig, "animation">;
  defaultAnimationPreset?: ValueOf<IToastivaConfig, "animationPreset">;
  defaultBodyRadius?: number;
  defaultCornerSmoothing?: number;
  defaultBodyLayout: TToastivaBodyLayout;
  defaultDisableIOSBlur?: ValueOf<IToastivaConfig, "disableIOSBlur">;
  defaultExpandedHeight?: ValueOf<IToastivaConfig, "expandedHeight">;
  defaultExpandedWidth?: number;
  defaultFill?: ValueOf<IToastivaConfig, "fill">;
  defaultHorizontalInset: number;
  defaultIOSBlurTint?: ValueOf<IToastivaConfig, "iosBlurTint">;
  defaultShowProgress: boolean;
  defaultShowTimestamp: boolean;
  defaultSpringConfig?: ValueOf<IToastivaConfig, "springConfig">;
  defaultStroke?: ValueOf<IToastivaConfig, "stroke">;
  defaultStyles?: ValueOf<IToastivaConfig, "styles">;
  dismissPaused?: boolean;
  expanded: boolean;
  expandedOffset: number;
  forceCollapsed?: boolean;
  frontHeight: number;
  gap: number;
  index: number;
  morphMode?: boolean;
  onHeightChange: (id: string, height: number) => void;
  onRemove: (id: string) => void;
  onStackPress?: () => void;
  position: TToastivaPosition;
  swipeThreshold: number;
  swipeToDismiss: boolean;
  toast: IToastivaData;
  totalCount: number;
  visibleCount: number;
}

export type { IToastivaProps };
