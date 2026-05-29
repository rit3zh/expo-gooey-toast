import React, { memo } from "react";
import { Platform, Pressable } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { styles } from "../styles/toast.styles";
import type { IToastCardProps } from "../typings";
import { ToastivaHorizontalAlign } from "../typings";
import { ToastMeasure } from "./ToastMeasure";
import { ToastSurface } from "./ToastSurface";

const ToastCard: React.MemoExoticComponent<React.FC<IToastCardProps>> = memo(
  ({
    ...props
  }: IToastCardProps): (React.ReactNode & React.ReactElement) | null => {
    const mirrored = props.morphAlign === ToastivaHorizontalAlign.Right;
    const stackAlign =
      props.stackAlign === ToastivaHorizontalAlign.Center
        ? "center"
        : props.stackAlign === ToastivaHorizontalAlign.Right
          ? "flex-end"
          : "flex-start";
    const morphAlign =
      props.morphAlign === ToastivaHorizontalAlign.Center
        ? "center"
        : props.morphAlign === ToastivaHorizontalAlign.Right
          ? "flex-end"
          : "flex-start";

    return (
      <Animated.View
        style={[
          styles.toastOuter,
          props.isTop ? styles.anchorTop : styles.anchorBottom,
          { alignItems: stackAlign },
          props.animated.cardStyle,
        ]}
      >
        <GestureDetector gesture={props.gesture}>
          <Pressable onPress={props.onPress} style={styles.pressable}>
            <Animated.View
              style={[
                styles.surfaceShell,
                Platform.OS === "ios" ? styles.surfaceShadow : null,
                props.styleOverrides?.container,
                props.animated.shellStyle,
              ]}
            >
              <Animated.View
                style={[
                  styles.clipContainer,
                  styles.clipFill,
                  { alignItems: morphAlign },
                  props.animated.clipStyle,
                ]}
              >
                <ToastSurface
                  toast={props.toast}
                  Icon={props.Icon}
                  actionStyle={props.animated.actionStyle}
                  animatedPathProps={props.animated.animatedPathProps}
                  bodyLayout={props.bodyLayout}
                  bodyStyle={props.animated.bodyStyle}
                  bodyWidth={props.widths.bodyWidth}
                  headerAlign={props.headerAlign}
                  headerMaxWidthStyle={props.animated.headerMaxWidthStyle}
                  color={props.color}
                  canInteract={props.isFront || props.expanded}
                  contentStyle={props.animated.contentStyle}
                  descriptionStyle={props.animated.descriptionStyle}
                  disableIOSBlur={props.disableIOSBlur}
                  meta={props.meta}
                  iosBlurTint={props.iosBlurTint}
                  mirrored={mirrored}
                  morphSpringConfig={props.morphSpringConfig}
                  noHeader={props.noHeader}
                  onAction={props.onAction}
                  progressStyle={props.animated.progressStyle}
                  renderHeight={props.heights.renderHeight}
                  showBody={props.showBody}
                  showProgress={props.showProgress}
                  stroke={props.stroke}
                  styleOverrides={props.styleOverrides}
                  surfaceFill={props.surfaceFill}
                />
              </Animated.View>
            </Animated.View>
            <ToastMeasure
              bodyLayout={props.bodyLayout}
              bodyWidth={props.widths.bodyWidth}
              headerAlign={props.headerAlign}
              color={props.color}
              Icon={props.Icon}
              meta={props.meta}
              measureBody={props.measureBody}
              noHeader={props.noHeader}
              onMeasureCard={props.measure.onMeasureCard}
              onMeasureHeader={props.measure.onMeasureHeader}
              styleOverrides={props.styleOverrides}
              toast={props.toast}
            />
          </Pressable>
        </GestureDetector>
      </Animated.View>
    );
  },
);

export { ToastCard };
