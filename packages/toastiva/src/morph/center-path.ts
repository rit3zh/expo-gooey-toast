import { PH } from "../constants";
import { smoothCorner } from "./smooth-corner";

function morphPathCenter(
  pw: number,
  bw: number,
  th: number,
  t: number,
  cw?: number,
  radius = 16,
  noHeader = false,
  smoothing = 0,
): string {
  "worklet";
  const pr = PH / 2;
  const s = smoothing < 0 ? 0 : smoothing > 1 ? 1 : smoothing;
  const grow = 1 + s;
  if (noHeader) {
    const h = Math.max(PH + (th - PH) * t, PH);
    const canvasW0 = cw ?? bw;
    const left = (canvasW0 - bw) / 2;
    const right = left + bw;
    const startR = PH / 2;
    const cr = startR + (Math.min(radius, bw / 2) - startR) * t;
    const safeR = Math.min(cr, bw / 2 / grow, h / 2 / grow);
    return [
      `M ${left + safeR * grow},0`,
      smoothCorner(right, 0, 1, 0, 0, 1, safeR, s),
      smoothCorner(right, h, 0, 1, -1, 0, safeR, s),
      smoothCorner(left, h, -1, 0, 0, -1, safeR, s),
      smoothCorner(left, 0, 0, -1, 1, 0, safeR, s),
      "Z",
    ].join(" ");
  }
  // Use static canvas width (cw) for pill positioning so pillOffset stays
  // constant during expansion (bw springs from pillWidth → expandedWidth).
  // Do not clamp pillW — clipContainer clips visually; SVG uses overflow=visible.
  const canvasW = cw ?? bw;
  const pillW = pw;
  const pillOffset = (canvasW - pillW) / 2;
  const bodyH = PH + (th - PH) * t;

  if (t <= 0 || bodyH - PH < 8) {
    return [
      `M ${pillOffset},${pr}`,
      `A ${pr},${pr} 0 0 1 ${pillOffset + pr},0`,
      `H ${pillOffset + pillW - pr}`,
      `A ${pr},${pr} 0 0 1 ${pillOffset + pillW},${pr}`,
      `A ${pr},${pr} 0 0 1 ${pillOffset + pillW - pr},${PH}`,
      `H ${pillOffset + pr}`,
      `A ${pr},${pr} 0 0 1 ${pillOffset},${pr}`,
      "Z",
    ].join(" ");
  }

  const curve = 14 * t;
  const cr = Math.min(Math.max(0, radius), (bodyH - PH) * 0.45);
  const halfWidth = pillW / 2 + ((bw - pillW) / 2) * t;
  const bodyLeft = bw / 2 - halfWidth;
  const bodyRight = bw / 2 + halfWidth;
  const bodyTop = PH - curve;
  const qLeftX = Math.max(bodyLeft + cr, pillOffset - curve);
  const qRightX = Math.min(bodyRight - cr, pillOffset + pillW + curve);

  // Per-corner radii, shrunk so the squircle shoulder (r * grow) always fits
  // the available straight run — prevents the smoothing from overshooting the
  // short top edges next to the pill junction.
  const vHalf = (bodyH - (bodyTop + curve)) / 2;
  const hHalf = (bodyRight - bodyLeft) / 2;
  const gR = bodyRight - qRightX;
  const gL = qLeftX - bodyLeft;
  const rTR = Math.min(cr, gR / grow, vHalf / grow);
  const rBR = Math.min(cr, vHalf / grow, hHalf / grow);
  const rBL = Math.min(cr, hHalf / grow, vHalf / grow);
  const rTL = Math.min(cr, vHalf / grow, gL / grow);

  return [
    `M ${pillOffset},${pr}`,
    `A ${pr},${pr} 0 0 1 ${pillOffset + pr},0`,
    `H ${pillOffset + pillW - pr}`,
    `A ${pr},${pr} 0 0 1 ${pillOffset + pillW},${pr}`,
    `L ${pillOffset + pillW},${bodyTop}`,
    `Q ${pillOffset + pillW},${bodyTop + curve} ${qRightX},${bodyTop + curve}`,
    smoothCorner(bodyRight, bodyTop + curve, 1, 0, 0, 1, rTR, s),
    smoothCorner(bodyRight, bodyH, 0, 1, -1, 0, rBR, s),
    smoothCorner(bodyLeft, bodyH, -1, 0, 0, -1, rBL, s),
    smoothCorner(bodyLeft, bodyTop + curve, 0, -1, 1, 0, rTL, s),
    `H ${qLeftX}`,
    `Q ${pillOffset},${bodyTop + curve} ${pillOffset},${bodyTop}`,
    "Z",
  ].join(" ");
}

export { morphPathCenter };
