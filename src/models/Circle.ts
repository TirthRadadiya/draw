import { Shape } from "./Shape";
import type { ShapeObject } from "../types/types";

export class Circle extends Shape {
  constructor(config: Omit<ShapeObject, "type"> & { type?: "circle" }) {
    super({ ...config, type: "circle" });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.applyStyles(ctx);

    // Use the bounding box to handle negative width/height
    const { x, y, width, height } = this.getBoudingBox();

    const radiusX = width / 2;
    const radiusY = height / 2;
    const centerX = x + radiusX;
    const centerY = y + radiusY;

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    if (this.fillColor) ctx.fill();
    ctx.stroke();
  }

  isPointInside(px: number, py: number): boolean {
    const { x, y, width, height } = this.getBoudingBox();
    const radiusX = width / 2;
    const radiusY = height / 2;

    if (radiusX === 0 || radiusY === 0) return false;

    const centerX = x + radiusX;
    const centerY = y + radiusY;

    const value =
      (px - centerX) ** 2 / radiusX ** 2 + (py - centerY) ** 2 / radiusY ** 2;
    return value <= 1;
  }
}
