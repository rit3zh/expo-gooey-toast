import { PILL_PADDING_H } from "../constants";
import type {
  IHeaderLayerParams,
  IToastHeaderSmearTitleStyleParams,
  IToastHeaderTitleStyleParams,
} from "../typings";

const HEADER_BLUR_INTENSITY = 15;
const HEADER_LAYER_CLEAR_MS = 450;
const HEADER_SMEAR_OFFSET = 14;
const HEADER_SMEAR_OPACITY = 0.6;
const HEADER_SMEAR_SCALE = 1.18;
const HEADER_SMEAR_TEXT_RADIUS = 15;
const HEADER_TITLE_ENTER_OFFSET = 15;
const HEADER_TITLE_EXIT_OFFSET = 12;
const HEADER_TITLE_EXIT_MS = 420;
const HEADER_TITLE_MORPH_MS = 800;

function createHeaderLayer<T extends IHeaderLayerParams>(props: T) {
  return {
    key: `${props.type}:${props.title}:${props.headerContent ? "custom" : "default"}`,
    type: props.type,
    title: props.title,
    Icon: props.Icon,
    color: props.color,
    headerContent: props.headerContent,
    icon: props.icon,
    showIcon: props.showIcon,
    showIconBadge: props.showIconBadge,
  };
}

function getHeaderTitleStyle({ titleStyle }: IToastHeaderTitleStyleParams) {
  return titleStyle;
}

function getSmearTitleStyle({ color }: IToastHeaderSmearTitleStyleParams) {
  return {
    textShadowColor: color,
    textShadowOffset: headerTextShadowOffset,
    textShadowRadius: HEADER_SMEAR_TEXT_RADIUS,
  };
}

const headerContentStyle = {
  alignItems: "center" as const,
  flexDirection: "row" as const,
};

const headerOverlayContentStyle = {
  alignItems: "center" as const,
  bottom: 0,
  flexDirection: "row" as const,
  left: PILL_PADDING_H,
  position: "absolute" as const,
  top: 0,
};

const headerRootStyle = {
  // No overflow:"hidden" here. The clipContainer (borderRadius: PH/2,
  // overflow:"hidden") is the pill-shaped clip boundary for all content.
  // Adding overflow:"hidden" without borderRadius on the header creates a
  // rectangular clip at maxWidth that makes text look square at the pill edge.
  position: "relative" as const,
};

const headerTextShadowOffset = { width: 0, height: 0 };

export {
  createHeaderLayer,
  getHeaderTitleStyle,
  getSmearTitleStyle,
  HEADER_BLUR_INTENSITY,
  HEADER_LAYER_CLEAR_MS,
  HEADER_SMEAR_OFFSET,
  HEADER_SMEAR_OPACITY,
  HEADER_SMEAR_SCALE,
  HEADER_TITLE_ENTER_OFFSET,
  HEADER_TITLE_EXIT_MS,
  HEADER_TITLE_EXIT_OFFSET,
  HEADER_TITLE_MORPH_MS,
  headerContentStyle,
  headerOverlayContentStyle,
  headerRootStyle,
};
