// Continuous-curvature ("squircle" / superellipse) corner builder.
//
// A plain SVG circular arc (`A r,r …`) is only G1-continuous: the tangent
// matches at the join but curvature jumps instantly from 0 to 1/r, which the
// eye reads as a subtle hard edge. Apple's rounded rects (and the gooey
// Dynamic-Island look) use a superellipse corner that ramps curvature in
// gradually (≈G2), so the transition reads as "liquid smooth".
//
// `smoothCorner` emits "L … C …" for a single corner of any orientation, so
// all three morph paths (left / center / right) can share it.
//
//   (cx,cy)        the sharp elbow point (where two straight edges would meet)
//   (ix,iy)        unit vector of the edge ARRIVING at the elbow
//   (ox,oy)        unit vector of the edge LEAVING the elbow
//   r              corner radius
//   s              smoothing 0..1  (0 = circular arc, 1 = full squircle)
//
// Each corner consumes r*(1+s) of straight edge on both sides, so callers
// must keep enough room (clamp r against the available edge length).

const BEZIER_KAPPA = 0.5519150244935105; // matches a circular quarter-arc
const SQUIRCLE_KAPPA = 0.9091; // fuller, superellipse-like handle

function smoothCorner(
  cx: number,
  cy: number,
  ix: number,
  iy: number,
  ox: number,
  oy: number,
  r: number,
  s: number,
): string {
  "worklet";
  const smoothing = s < 0 ? 0 : s > 1 ? 1 : s;
  const shoulder = r * smoothing;
  const d = r + shoulder;
  const h = d * (BEZIER_KAPPA + smoothing * (SQUIRCLE_KAPPA - BEZIER_KAPPA));

  // tangent points: pull back along the incoming edge, push out along outgoing
  const ax = cx - ix * d;
  const ay = cy - iy * d;
  const bx = cx + ox * d;
  const by = cy + oy * d;

  // control handles bend from each tangent point toward the elbow
  const c1x = ax + ix * h;
  const c1y = ay + iy * h;
  const c2x = bx - ox * h;
  const c2y = by - oy * h;

  return `L ${ax},${ay} C ${c1x},${c1y} ${c2x},${c2y} ${bx},${by}`;
}

export { smoothCorner };
