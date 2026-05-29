import React from "react";
import Svg, { Circle, Line, Path } from "react-native-svg";
import type { IToastIcon } from "../typings/dummy-icons/Icons";

const CircleIcon = ({
  children,
  color,
  size = 16,
}: React.PropsWithChildren<IToastIcon>) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
    {children}
  </Svg>
);

const SuccessIcon = ({ color, size }: IToastIcon) => (
  <CircleIcon color={color} size={size}>
    <Path
      d="M9 12l2 2 4-4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </CircleIcon>
);
const ErrorIcon = ({ color, size }: IToastIcon) => (
  <CircleIcon color={color} size={size}>
    <Path d="M15 9l-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M9 9l6 6" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </CircleIcon>
);
const WarningIcon = ({ color, size }: IToastIcon) => (
  <CircleIcon color={color} size={size}>
    <Line
      x1={12}
      y1={8}
      x2={12}
      y2={12}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1={12}
      y1={16}
      x2={12.01}
      y2={16}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </CircleIcon>
);
const InfoIcon = ({ color, size }: IToastIcon) => (
  <CircleIcon color={color} size={size}>
    <Line
      x1={12}
      y1={16}
      x2={12}
      y2={12}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1={12}
      y1={8}
      x2={12.01}
      y2={8}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </CircleIcon>
);

const DefaultIcon = ({ color, size = 16 }: IToastIcon) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.73 21a2 2 0 0 1-3.46 0"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export { DefaultIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon };
