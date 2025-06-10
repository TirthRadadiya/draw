import { Shape } from "./Shape";
import type { ShapeObject } from "../types/types";

export class Rectangle extends Shape {
  constructor(config: Omit<ShapeObject, "type"> & { type?: "rectangle" }) {
    super({ ...config, type: "rectangle" });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.applyStyles(ctx);

    // Use the bounding box to handle negative width/height
    const { x, y, width, height } = this.getBoudingBox();

    ctx.beginPath();
    ctx.rect(x, y, width, height);
    if (this.fillColor) ctx.fill();
    ctx.stroke();
  }

  isPointInside(px: number, py: number): boolean {
    const { x, y, width, height } = this.getBoudingBox();
    return px >= x && px <= x + width && py >= y && py <= y + height;
  }
}
