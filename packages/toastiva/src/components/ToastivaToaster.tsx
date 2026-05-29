import type { IToastivaConfig, TToastivaPosition } from "../typings";
import { ToastivaBodyLayout, ToastivaMode, ToastivaPosition } from "../typings";
import React, { memo, useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  DEFAULT_DURATION,
  DEFAULT_GAP,
  DEFAULT_HORIZONTAL_INSET,
  DEFAULT_OFFSET,
  DEFAULT_SWIPE_THRESHOLD,
  DEFAULT_VISIBLE_TOASTS,
} from "../constants";
import { ToastThemeProvider } from "../context/theme";
import { useToasterState } from "../hooks/use-toaster-state";
import { removeToast, updateHeight } from "../store";
import {
  filterToastsForPosition,
  getDefaultVertical,
  TOASTIVA_POSITIONS,
} from "../utils/toast-position";
import { buildHeightMap } from "../utils/toaster-stack";
import { ToastMorphSlot } from "./ToastMorphSlot";
import { ToastStack } from "./ToastStack";

interface IToastivaToasterProps extends IToastivaConfig {
  disabled?: boolean;
}

const ToastivaToaster: React.MemoExoticComponent<
  React.FC<IToastivaToasterProps>
> =
  memo(
    ({
      animation,
      animationPreset,
      position = ToastivaPosition.TopCenter,
      duration = DEFAULT_DURATION,
      visibleToasts = DEFAULT_VISIBLE_TOASTS,
      gap = DEFAULT_GAP,
      expand = false,
      bodyLayout = ToastivaBodyLayout.Spread,
      bodyRadius,
      cornerSmoothing,
      disableIOSBlur,
      expandedHeight,
      expandedWidth,
      fill,
      horizontalInset = DEFAULT_HORIZONTAL_INSET,
      iosBlurTint,
      mode = ToastivaMode.Stack,
      offset: offsetProp = DEFAULT_OFFSET,
      showProgress = true,
      showTimestamp = true,
      springConfig,
      stroke,
      styles: styleOverrides,
      swipeToDismiss = true,
      swipeThreshold = DEFAULT_SWIPE_THRESHOLD,
      theme,
      disabled = false,
    }: IToastivaToasterProps): React.JSX.Element | null => {
      const { bottom, top } = useSafeAreaInsets();
      const { heights, toasts } = useToasterState<number>(duration);
      const heightMap = useMemo(() => buildHeightMap(heights), [heights]);
      const [expandedSlots, setExpandedSlots] = useState(() =>
        createExpandedSlots(expand),
      );
      const positionedToasts = useMemo(
        () =>
          TOASTIVA_POSITIONS.map((slotPosition) => ({
            position: slotPosition,
            toasts: filterToastsForPosition(toasts, position, slotPosition),
            vertical: getDefaultVertical(slotPosition),
          })),
        [position, toasts],
      );
      const isMorphMode = mode === ToastivaMode.Morph;

      useEffect(() => {
        if (disabled) return;
        setExpandedSlots(createExpandedSlots(expand));
      }, [disabled, expand]);
      useEffect(() => {
        if (disabled) return;
        setExpandedSlots((current) => {
          let changed = false;
          const next = { ...current };
          positionedToasts.forEach(({ position: slotPosition, toasts }) => {
            if (toasts.length <= 1 && next[slotPosition]) {
              next[slotPosition] = false;
              changed = true;
            }
          });
          return changed ? next : current;
        });
      }, [disabled, positionedToasts]);
      useEffect(() => {
        if (disabled) return;
        if (!isMorphMode) return;
        positionedToasts.forEach(({ toasts }) => {
          toasts.slice(1).forEach((toast) => removeToast(toast.id));
        });
      }, [disabled, isMorphMode, positionedToasts]);

      if (disabled || !toasts.length) return null;
      const content = isMorphMode ? (
        <ToastThemeProvider theme={theme}>
          {positionedToasts.map((slot) => (
            <ToastMorphSlot
              key={slot.position}
              bottomInset={bottom}
              heightMap={heightMap}
              horizontalInset={horizontalInset}
              offset={offsetProp}
              onHeightChange={updateHeight}
              onRemove={removeToast}
              position={slot.position}
              showProgress={showProgress}
              showTimestamp={showTimestamp}
              swipeThreshold={swipeThreshold}
              swipeToDismiss={swipeToDismiss}
              toasts={slot.toasts}
              defaultAnimation={animation}
              defaultAnimationPreset={animationPreset}
              defaultBodyLayout={bodyLayout}
              defaultBodyRadius={bodyRadius}
              defaultCornerSmoothing={cornerSmoothing}
              defaultDisableIOSBlur={disableIOSBlur}
              defaultExpandedHeight={expandedHeight}
              defaultExpandedWidth={expandedWidth}
              defaultFill={fill}
              defaultIOSBlurTint={iosBlurTint}
              defaultSpringConfig={springConfig}
              defaultStroke={stroke}
              defaultStyles={styleOverrides}
              topInset={top}
              vertical={slot.vertical}
            />
          ))}
        </ToastThemeProvider>
      ) : (
        <ToastThemeProvider theme={theme}>
          {positionedToasts.map((slot) => (
            <ToastStack
              key={slot.position}
              bottomInset={bottom}
              expand={expandedSlots[slot.position]}
              gap={gap}
              heightMap={heightMap}
              horizontalInset={horizontalInset}
              offset={offsetProp}
              onHeightChange={updateHeight}
              onRemove={removeToast}
              position={slot.position}
              setExpanded={(nextValue) =>
                setExpandedSlots((current) => ({
                  ...current,
                  [slot.position]:
                    typeof nextValue === "function"
                      ? nextValue(current[slot.position])
                      : nextValue,
                }))
              }
              showProgress={showProgress}
              showTimestamp={showTimestamp}
              swipeThreshold={swipeThreshold}
              swipeToDismiss={swipeToDismiss}
              toasts={slot.toasts}
              defaultAnimation={animation}
              defaultAnimationPreset={animationPreset}
              defaultBodyLayout={bodyLayout}
              defaultBodyRadius={bodyRadius}
              defaultCornerSmoothing={cornerSmoothing}
              defaultDisableIOSBlur={disableIOSBlur}
              defaultExpandedHeight={expandedHeight}
              defaultExpandedWidth={expandedWidth}
              defaultFill={fill}
              defaultIOSBlurTint={iosBlurTint}
              defaultSpringConfig={springConfig}
              defaultStroke={stroke}
              defaultStyles={styleOverrides}
              topInset={top}
              vertical={slot.vertical}
              visibleToasts={visibleToasts}
            />
          ))}
        </ToastThemeProvider>
      );

      return content;
    },
  );

function createExpandedSlots(expanded: boolean) {
  return Object.fromEntries(
    TOASTIVA_POSITIONS.map((position) => [position, expanded]),
  ) as Record<TToastivaPosition, boolean>;
}

export { ToastivaToaster };
