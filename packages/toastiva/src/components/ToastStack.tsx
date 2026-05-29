import { styles } from "../styles/toast.styles";
import type { IToastStackProps } from "../typings";
import {
  ToastivaBodyLayout,
  ToastivaHorizontalAlign,
  ToastivaPosition,
  ToastivaVerticalPosition,
} from "../typings";
import React, { memo, useCallback, useMemo } from "react";
import { Pressable, View } from "react-native";
import {
  getHorizontalPosition,
  resolveToastStackPosition,
} from "../utils/toast-position";
import {
  getCollapsedOffsets,
  getExpandedOffsets,
  getFrontHeight,
} from "../utils/toaster-stack";
import { Toastiva } from "./Toastiva";

const ToastStack: React.MemoExoticComponent<React.FC<IToastStackProps>> = memo(
  ({
    ...props
  }: IToastStackProps): (React.ReactNode & React.ReactElement) | null => {
    const { setExpanded, toasts } = props;
    const toastCount = toasts.length;

    const toggleExpanded = useCallback(() => {
      if (toastCount > 1) setExpanded((current) => !current);
    }, [setExpanded, toastCount]);

    const stack = useMemo(
      () => getToastStackRenderData(props),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        props.position,
        props.vertical,
        props.toasts,
        props.visibleToasts,
        props.gap,
        props.heightMap,
        props.topInset,
        props.bottomInset,
        props.offset,
      ],
    );

    if (!toastCount) return null;
    return (
      <Pressable
        onPress={toggleExpanded}
        style={[
          styles.toastOuter,
          styles.toasterContainer,
          stack.edgeStyle,
          stack.alignStyle,
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.toasterStack} pointerEvents="box-none">
          {stack.visibleToasts.map((toast, index) => (
            <Toastiva
              key={toast.id}
              toast={toast}
              index={index}
              totalCount={props.toasts.length}
              visibleCount={props.visibleToasts}
              expanded={props.expand}
              expandedOffset={stack.expandedOffsets.get(toast.id) ?? 0}
              collapsedOffset={stack.collapsedOffsets.get(toast.id) ?? 0}
              frontHeight={stack.frontHeight}
              position={stack.resolvedPosition}
              gap={props.gap}
              swipeToDismiss={props.swipeToDismiss}
              swipeThreshold={props.swipeThreshold}
              defaultAnimation={props.defaultAnimation}
              defaultAnimationPreset={props.defaultAnimationPreset}
              defaultBodyLayout={
                props.defaultBodyLayout ?? ToastivaBodyLayout.Spread
              }
              defaultBodyRadius={props.defaultBodyRadius}
              defaultCornerSmoothing={props.defaultCornerSmoothing}
              defaultDisableIOSBlur={props.defaultDisableIOSBlur}
              defaultExpandedHeight={props.defaultExpandedHeight}
              defaultExpandedWidth={props.defaultExpandedWidth}
              defaultFill={props.defaultFill}
              defaultHorizontalInset={props.horizontalInset}
              defaultIOSBlurTint={props.defaultIOSBlurTint}
              defaultShowProgress={props.showProgress}
              defaultShowTimestamp={props.showTimestamp}
              defaultSpringConfig={props.defaultSpringConfig}
              defaultStroke={props.defaultStroke}
              defaultStyles={props.defaultStyles}
              onRemove={props.onRemove}
              onHeightChange={props.onHeightChange}
              onStackPress={toggleExpanded}
            />
          ))}
        </View>
      </Pressable>
    );
  },
);

function getToastStackRenderData(props: IToastStackProps) {
  const resolvedPosition = resolveToastStackPosition(
    props.position ?? ToastivaPosition.TopCenter,
    props.vertical,
  );
  const horizontalPosition = getHorizontalPosition(resolvedPosition);
  const isCenter = horizontalPosition === ToastivaHorizontalAlign.Center;
  const isRight = horizontalPosition === ToastivaHorizontalAlign.Right;
  const edgeOffset =
    (props.vertical === ToastivaVerticalPosition.Top
      ? props.topInset
      : props.bottomInset) + props.offset;

  return {
    alignStyle: isCenter
      ? styles.toasterCenter
      : isRight
        ? {
            left: 0,
            right: 0,
            alignItems: "flex-end" as const,
            paddingRight: props.horizontalInset,
          }
        : {
            left: 0,
            right: 0,
            alignItems: "flex-start" as const,
            paddingLeft: props.horizontalInset,
          },
    collapsedOffsets: getCollapsedOffsets(
      props.toasts,
      props.visibleToasts,
      props.gap,
    ),
    edgeStyle:
      props.vertical === ToastivaVerticalPosition.Top
        ? { top: edgeOffset }
        : { bottom: edgeOffset },
    expandedOffsets: getExpandedOffsets(
      props.toasts,
      props.heightMap,
      props.gap,
    ),
    frontHeight: getFrontHeight(props.toasts, props.heightMap),
    resolvedPosition,
    visibleToasts: props.toasts.slice(0, props.visibleToasts),
  };
}

export { ToastStack };
