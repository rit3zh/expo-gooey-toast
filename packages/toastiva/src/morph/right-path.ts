import { PH } from "../constants";
import { smoothCorner } from "./smooth-corner";

// Right-aligned morph path. The shape is the mirror of `morphPath` (left):
//
//   ┌──────────────[pill]──[bw]
//   │                       │       <- pill top
//   └─[pillLeft]────────────┤
//                           │       <- continuous right edge
//   ┌─[bodyLeft]────────────┤
//   │                       │       <- body
//   └───────────────────────┘
//
// The pill and body share the right edge at x=bw, and the inward "curve"
// belongs on the LEFT (where the pill ends at pillLeft and the body extends
// further left to bodyLeft). Earlier this file mirrored the left path
// naively — putting the curve on the right and starting M at pillLeft —
// which made Z close as a long diagonal from the body's bottom-right back to
// the pill's left-mid, producing the visible "X cut" through the toast.
//
// Now the path traces the perimeter clockwise starting at the pill's
// top-left corner and ends at that same corner via the pill's top-left arc
// — Z is a no-op close (or vertical line back to M, depending on rounding).
function morphPathRight(
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
    const right = canvasW0;
    const left = right - bw;
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
  const canvasW = cw ?? bw;
  const pillW = pw;
  const pillLeft = canvasW - pillW;
  const bodyH = PH + (th - PH) * t;

  if (t <= 0 || bodyH - PH < 8) {
    return [
      `M ${pillLeft},${pr}`,
      `A ${pr},${pr} 0 0 1 ${pillLeft + pr},0`,
      `H ${canvasW - pr}`,
      `A ${pr},${pr} 0 0 1 ${canvasW},${pr}`,
      `A ${pr},${pr} 0 0 1 ${canvasW - pr},${PH}`,
      `H ${pillLeft + pr}`,
      `A ${pr},${pr} 0 0 1 ${pillLeft},${pr}`,
      "Z",
    ].join(" ");
  }

  const curve = 14 * t;
  const cr = Math.min(Math.max(0, radius), (bodyH - PH) * 0.45);
  const bodyLeft = bw - (pillW + (bw - pillW) * t);
  const bodyTop = PH - curve;
  const qStartX = Math.max(bodyLeft + cr, pillLeft - curve);

  const vHalf = (bodyH - (bodyTop + curve)) / 2;
  const hHalf = (bw - bodyLeft) / 2;
  const gL = qStartX - bodyLeft;
  const rBR = Math.min(cr, hHalf / grow, vHalf / grow);
  const rBL = Math.min(cr, hHalf / grow, vHalf / grow);
  const rTL = Math.min(cr, vHalf / grow, gL / grow);

  return [
    `M ${pillLeft + pr},0`, // pill top-left corner (start)
    `H ${bw - pr}`, // pill top edge (going right)
    `A ${pr},${pr} 0 0 1 ${bw},${pr}`, // pill top-right arc
    smoothCorner(bw, bodyH, 0, 1, -1, 0, rBR, s), // continuous right edge → body bottom-right
    smoothCorner(bodyLeft, bodyH, -1, 0, 0, -1, rBL, s), // body bottom-left
    smoothCorner(bodyLeft, bodyTop + curve, 0, -1, 1, 0, rTL, s), // body top-left
    `H ${qStartX}`, // body top (going right toward pill)
    `Q ${pillLeft},${bodyTop + curve} ${pillLeft},${bodyTop}`, // inside corner curve up to pill
    `L ${pillLeft},${pr}`, // pill left edge (going up)
    `A ${pr},${pr} 0 0 1 ${pillLeft + pr},0`, // pill top-left arc (closes to M)
    "Z",
  ].join(" ");
}

export { morphPathRight };
