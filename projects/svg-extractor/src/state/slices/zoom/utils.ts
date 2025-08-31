import { Vector2D } from "../../../types/shape";
import { ZoomMode } from "./types";

export function computeZoom(
  image: Vector2D,
  canvas: Vector2D,
  mode: ZoomMode = ZoomMode.CONTAIN
): number {
  const [iw, ih] = image;
  const [cw, ch] = canvas;

  if (iw <= 0 || ih <= 0 || cw <= 0 || ch <= 0) {
    return 1;
  }

  const sx = cw / iw;
  const sy = ch / ih;

  let zoom;
  switch (mode) {
    case ZoomMode.COVER:
      zoom = Math.max(sx, sy);
      break;
    case ZoomMode.FIT_WIDTH:
      zoom = sx;
      break;
    case ZoomMode.FIT_HEIGHT:
      zoom = sy;
      break;
    case ZoomMode.CONTAIN:
    default:
      zoom = Math.min(sx, sy);
  }

  return zoom;
}
