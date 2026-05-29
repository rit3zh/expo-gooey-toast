import { MORPH_SWAP_COLLAPSE_MS } from "../constants/index";
import { styles } from "../styles/toast.styles";
import {
  ToastivaBodyLayout,
  ToastivaHorizontalAlign,
  ToastivaPosition,
  ToastivaVerticalPosition,
  type IToastMorphSlotProps,
  type IToastivaData,
} from "../typings";
import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Platform, Pressable, View } from "react-native";
import {
  getHorizontalPosition,
  resolveToastStackPosition,
} from "../utils/toast-position";
import { getFrontHeight } from "../utils/toaster-stack";
import { Toastiva } from "./Toastiva";

const ToastMorphSlot: React.MemoExoticComponent<
  React.FC<IToastMorphSlotProps>
> = memo(
  ({
    ...props
  }: IToastMorphSlotProps): (React.ReactNode & React.ReactElement) | null => {
    const incomingToast = props.toasts[0];
    const [displayToast, setDisplayToast] = useState<IToastivaData | undefined>(
      () => incomingToast,
    );
    const [pendingToast, setPendingToast] = useState<
      IToastivaData | undefined
    >();
    const pendingToastRef = useRef<IToastivaData | undefined>(undefined);
    const swapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useLayoutEffect(() => {
      if (!incomingToast) {
        setDisplayToast(undefined);
        setPendingToast(undefined);
        pendingToastRef.current = undefined;
        if (swapTimerRef.current) {
          clearTimeout(swapTimerRef.current);
          swapTimerRef.current = null;
        }
        return;
      }

      if (!displayToast || displayToast.id === incomingToast.id) {
        setDisplayToast(incomingToast);
        return;
      }

      const isDisplayToastGone = !props.toasts.some(
        (t) => t.id === displayToast.id,
      );
      const shouldCollapseBeforeSwap =
        hasToastBody(displayToast) &&
        (!isDisplayToastGone || Platform.OS === "android");
      if (!shouldCollapseBeforeSwap) {
        pendingToastRef.current = undefined;
        setPendingToast(undefined);
        if (swapTimerRef.current) {
          clearTimeout(swapTimerRef.current);
          swapTimerRef.current = null;
        }
        setDisplayToast(incomingToast);
        return;
      }

      pendingToastRef.current = incomingToast;
      setPendingToast(incomingToast);
      if (swapTimerRef.current) return;

      swapTimerRef.current = setTimeout(() => {
        swapTimerRef.current = null;
        const nextToast = pendingToastRef.current;
        pendingToastRef.current = undefined;
        setPendingToast(undefined);
        if (nextToast) setDisplayToast(nextToast);
      }, MORPH_SWAP_COLLAPSE_MS);
    }, [displayToast, incomingToast]);

    useEffect(() => {
      return () => {
        if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
      };
    }, []);

    if (!displayToast) return null;

    const slot = getToastMorphSlotRenderData(props);
    const isReplacing =
      Boolean(pendingToast) && pendingToast?.id !== displayToast.id;

    return (
      <Pressable
        style={[
          styles.toastOuter,
          styles.toasterContainer,
          slot.edgeStyle,
          slot.alignStyle,
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.toasterStack} pointerEvents="box-none">
          <Toastiva
            toast={displayToast}
            index={0}
            totalCount={1}
            visibleCount={1}
            dismissPaused={isReplacing}
            expanded={false}
            expandedOffset={0}
            forceCollapsed={isReplacing}
            collapsedOffset={0}
            frontHeight={slot.frontHeight}
            position={slot.resolvedPosition}
            gap={0}
            morphMode
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
          />
        </View>
      </Pressable>
    );
  },
);

function hasToastBody(toast: IToastivaData) {
  return Boolean(toast.description || toast.action || toast.content);
}

function getToastMorphSlotRenderData(props: IToastMorphSlotProps) {
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
    edgeStyle:
      props.vertical === ToastivaVerticalPosition.Top
        ? { top: edgeOffset }
        : { bottom: edgeOffset },
    frontHeight: getFrontHeight(props.toasts, props.heightMap),
    resolvedPosition,
  };
}

export { ToastMorphSlot };
