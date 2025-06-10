import { Shape } from "../models/Shape";
import type { HandlePosition } from "../types/types";

export const HANDLE_SIZE = 8;

interface Handle {
  position: HandlePosition;
  x: number;
  y: number;
}

export function getHandlesForShape(shape: Shape): Handle[] {
  const { x, y, width, height } = shape;
  const halfW = width / 2;
  const halfH = height / 2;

  if (shape.type === "line") {
    return [
      { position: "start", x: shape.x, y: shape.y },
      { position: "end", x: shape.x + shape.width, y: shape.y + shape.height },
    ];
  }

  return [
    { position: "topLeft", x, y },
    { position: "topRight", x: x + width, y },
    { position: "bottomLeft", x, y: y + height },
    { position: "bottomRight", x: x + width, y: y + height },
    { position: "top", x: x + halfW, y },
    { position: "bottom", x: x + halfW, y: y + height },
    { position: "left", x, y: y + halfH },
    { position: "right", x: x + width, y: y + halfH },
  ];
}

export function getHandleAtPosition(
  pos: { x: number; y: number },
  shape: Shape
): HandlePosition | null {
  const handles = getHandlesForShape(shape);
  for (const handle of handles) {
    const dist = Math.sqrt((pos.x - handle.x) ** 2 + (pos.y - handle.y) ** 2);
    if (dist <= HANDLE_SIZE) {
      // a more generous click area
      return handle.position;
    }
  }
  return null;
}

export function getCursorForHandle(handle: HandlePosition): string {
  switch (handle) {
    case "topLeft":
    case "bottomRight":
      return "nwse-resize";
    case "topRight":
    case "bottomLeft":
      return "nesw-resize";
    case "top":
    case "bottom":
      return "ns-resize";
    case "left":
    case "right":
      return "ew-resize";
    case "start":
    case "end":
      return "pointer";
    default:
      return "default";
  }
}
