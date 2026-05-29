import type { ReactNode } from "react";
import type { BlurViewProps } from "expo-blur";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { WithSpringConfig } from "react-native-reanimated";

enum ToastivaBodyLayout {
  Left = "left",
  Center = "center",
  Right = "right",
  Spread = "spread",
}

enum ToastivaHorizontalAlign {
  Left = "left",
  Center = "center",
  Right = "right",
}

enum ToastivaMode {
  Stack = "stack",
  Morph = "morph",
}

enum ToastivaAnimationPreset {
  Gentle = "gentle",
  Minimal = "minimal",
  Smooth = "smooth",
  Snappy = "snappy",
}

enum ToastivaPosition {
  TopLeft = "top-left",
  TopCenter = "top-center",
  TopRight = "top-right",
  BottomLeft = "bottom-left",
  BottomCenter = "bottom-center",
  BottomRight = "bottom-right",
}

enum ToastivaType {
  Default = "default",
  Success = "success",
  Error = "error",
  Warning = "warning",
  Info = "info",
}

enum ToastivaVerticalPosition {
  Top = "top",
  Bottom = "bottom",
}

type TToastivaPosition = `${ToastivaPosition}`;
type TToastivaPositionInput = TToastivaPosition | TToastivaVerticalPosition;
type TToastivaType = `${ToastivaType}`;
type TToastivaMode = `${ToastivaMode}`;
type TToastivaAnimationAxis = "none" | "x" | "y";
type TToastivaAnimationPreset = `${ToastivaAnimationPreset}`;
type TToastivaBodyLayout = `${ToastivaBodyLayout}`;
type TToastivaHorizontalAlign = `${ToastivaHorizontalAlign}`;
type TToastivaPromiseDescription<TData> =
  | string
  | ((value: TData) => string | undefined);
type TToastivaPromiseMessage<TData> = string | ((value: TData) => string);
type TToastivaSpringConfig = Partial<WithSpringConfig>;
type TToastivaVerticalPosition = `${ToastivaVerticalPosition}`;
type TToastivaIOSBlurTint = NonNullable<BlurViewProps["tint"]>;

interface IToastivaAnimationSpringConfig {
  bodyReveal?: TToastivaSpringConfig;
  morph?: TToastivaSpringConfig;
  mount?: TToastivaSpringConfig;
  pillResize?: TToastivaSpringConfig;
  squish?: TToastivaSpringConfig;
  stack?: TToastivaSpringConfig;
}

interface IToastivaMountAnimationConfig {
  axis?: TToastivaAnimationAxis;
  duration?: number;
  offset?: number;
}

interface IToastivaMorphAnimationConfig {
  actionDelay?: number;
  bodyFadeDelay?: number;
  bodyFadeDuration?: number;
  collapseDuration?: number;
  descriptionDelay?: number;
  squishDelay?: number;
  squishDuration?: number;
  squishScaleX?: number;
  squishScaleY?: number;
}

interface IToastivaStackAnimationConfig {
  collapseDelay?: number;
  duration?: number;
  minOpacity?: number;
  minScale?: number;
  opacityStep?: number;
  scaleStep?: number;
}

interface IToastivaCompactAnimationConfig {
  squishDuration?: number;
  squishScaleX?: number;
  squishScaleY?: number;
}

interface IToastivaAnimationConfig {
  compact?: IToastivaCompactAnimationConfig;
  morph?: IToastivaMorphAnimationConfig;
  mount?: IToastivaMountAnimationConfig;
  preset?: TToastivaAnimationPreset;
  springs?: IToastivaAnimationSpringConfig;
  stack?: IToastivaStackAnimationConfig;
}

interface IToastivaAction {
  label: string;
  onPress: () => void;
}

interface IToastivaTheme {
  colors?: Partial<Record<TToastivaType, string>>;
  surfaceColors?: Partial<Record<TToastivaType, string>>;
  surfaceStrokeColors?: Partial<Record<TToastivaType, string>>;
  badgeBgColors?: Partial<Record<TToastivaType, string>>;
  actionColors?: Partial<Record<TToastivaType, string>>;
  actionTextColors?: Partial<Record<TToastivaType, string>>;
}

interface IToastivaTiming {
  displayDuration?: number;
  expandDuration?: number;
  collapseDuration?: number;
}

interface IToastivaStyleOverrides {
  action?: StyleProp<ViewStyle>;
  actionText?: StyleProp<TextStyle>;
  badge?: StyleProp<ViewStyle>;
  body?: StyleProp<ViewStyle>;
  container?: StyleProp<ViewStyle>;
  content?: StyleProp<ViewStyle>;
  description?: StyleProp<TextStyle>;
  header?: StyleProp<ViewStyle>;
  meta?: StyleProp<TextStyle>;
  progressFill?: StyleProp<ViewStyle>;
  progressTrack?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
}

interface IToastivaOptions {
  action?: IToastivaAction;
  animation?: IToastivaAnimationConfig;
  animationPreset?: TToastivaAnimationPreset;
  bodyLayout?: TToastivaBodyLayout;
  bodyRadius?: number;
  cornerSmoothing?: number;
  content?: ReactNode;
  description?: string;
  disableIOSBlur?: boolean;
  dismissible?: boolean;
  duration?: number;
  expandedHeight?: number;
  expandedWidth?: number;
  fill?: string;
  headerContent?: ReactNode;
  horizontalInset?: number;
  icon?: ReactNode;
  iosBlurTint?: TToastivaIOSBlurTint;
  isLoading?: boolean;
  meta?: string;
  onAutoClose?: () => void;
  onDismiss?: () => void;
  position?: TToastivaPositionInput;
  showHeader?: boolean;
  showIcon?: boolean;
  showIconBadge?: boolean;
  showProgress?: boolean;
  showTimestamp?: boolean;
  springConfig?: TToastivaSpringConfig;
  stroke?: string;
  styles?: IToastivaStyleOverrides;
  timing?: IToastivaTiming;
  title: string;
  type?: TToastivaType;
}
interface IResolvedToastTheme {
  colors: Record<TToastivaType, string>;
  surfaceColors: Record<TToastivaType, string>;
  surfaceStrokeColors: Record<TToastivaType, string>;
  badgeBgColors: Record<TToastivaType, string>;
  actionColors: Record<TToastivaType, string>;
  actionTextColors: Record<TToastivaType, string>;
}

interface IToastivaData {
  action?: IToastivaAction;
  animation?: IToastivaAnimationConfig;
  animationPreset?: TToastivaAnimationPreset;
  bodyLayout?: TToastivaBodyLayout;
  bodyRadius?: number;
  cornerSmoothing?: number;
  content?: ReactNode;
  createdAt: number;
  description?: string;
  disableIOSBlur?: boolean;
  dismissible: boolean;
  duration: number;
  expandedHeight?: number;
  expandedWidth?: number;
  fill?: string;
  headerContent?: ReactNode;
  horizontalInset?: number;
  icon?: ReactNode;
  iosBlurTint?: TToastivaIOSBlurTint;
  isLoading?: boolean;
  id: string;
  meta?: string;
  onAutoClose?: () => void;
  onDismiss?: () => void;
  position?: TToastivaPositionInput;
  showHeader?: boolean;
  showIcon?: boolean;
  showIconBadge?: boolean;
  showProgress?: boolean;
  showTimestamp?: boolean;
  springConfig?: TToastivaSpringConfig;
  stroke?: string;
  styles?: IToastivaStyleOverrides;
  timing?: IToastivaTiming;
  title: string;
  type: TToastivaType;
}

interface IToastivaPromiseAction {
  error?: IToastivaAction;
  success?: IToastivaAction;
}

interface IToastivaPromiseDescription<TResult, TError = unknown> {
  error?: TToastivaPromiseDescription<TError>;
  loading?: string;
  success?: TToastivaPromiseDescription<TResult>;
}

interface IToastivaPromiseIcon {
  error?: ReactNode;
  loading?: ReactNode;
  success?: ReactNode;
}

interface IToastivaPromiseData<TResult, TError = unknown> extends Omit<
  IToastivaOptions,
  "action" | "description" | "dismissible" | "icon" | "title" | "type"
> {
  action?: IToastivaPromiseAction;
  description?: IToastivaPromiseDescription<TResult, TError>;
  error: TToastivaPromiseMessage<TError>;
  icon?: IToastivaPromiseIcon;
  loading: string;
  success: TToastivaPromiseMessage<TResult>;
}

interface IToastivaConfig {
  animation?: IToastivaAnimationConfig;
  animationPreset?: TToastivaAnimationPreset;
  bodyLayout?: TToastivaBodyLayout;
  bodyRadius?: number;
  cornerSmoothing?: number;
  disableIOSBlur?: boolean;
  duration?: number;
  expand?: boolean;
  expandedHeight?: number;
  expandedWidth?: number;
  fill?: string;
  gap?: number;
  horizontalInset?: number;
  iosBlurTint?: TToastivaIOSBlurTint;
  mode?: TToastivaMode;
  offset?: number;
  position?: TToastivaPosition;
  showProgress?: boolean;
  showTimestamp?: boolean;
  springConfig?: TToastivaSpringConfig;
  stroke?: string;
  styles?: IToastivaStyleOverrides;
  swipeThreshold?: number;
  swipeToDismiss?: boolean;
  theme?: IToastivaTheme;
  visibleToasts?: number;
}

interface IToastivaProviderProps extends IToastivaConfig {
  children: ReactNode;
}

export {
  ToastivaAnimationPreset,
  ToastivaBodyLayout,
  ToastivaHorizontalAlign,
  ToastivaMode,
  ToastivaPosition,
  ToastivaType,
  ToastivaVerticalPosition,
};
export type {
  IResolvedToastTheme,
  IToastivaAnimationConfig,
  IToastivaAnimationSpringConfig,
  IToastivaAction,
  IToastivaCompactAnimationConfig,
  IToastivaConfig,
  IToastivaData,
  IToastivaMorphAnimationConfig,
  IToastivaMountAnimationConfig,
  IToastivaOptions,
  IToastivaPromiseAction,
  IToastivaPromiseData,
  IToastivaPromiseDescription,
  IToastivaPromiseIcon,
  IToastivaProviderProps,
  IToastivaStackAnimationConfig,
  IToastivaStyleOverrides,
  IToastivaTheme,
  IToastivaTiming,
  TToastivaAnimationAxis,
  TToastivaAnimationPreset,
  TToastivaBodyLayout,
  TToastivaHorizontalAlign,
  TToastivaIOSBlurTint,
  TToastivaMode,
  TToastivaPosition,
  TToastivaPositionInput,
  TToastivaPromiseDescription,
  TToastivaPromiseMessage,
  TToastivaSpringConfig,
  TToastivaType,
  TToastivaVerticalPosition,
};
