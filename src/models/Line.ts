import { Shape } from "./Shape";
import type { ShapeObject } from "../types/types";

export class Line extends Shape {
  constructor(config: Omit<ShapeObject, "type"> & { type?: "line" }) {
    super({ ...config, type: "line", fillColor: undefined });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.applyStyles(ctx);
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.stroke();
  }

  isPointInside(px: number, py: number): boolean {
    // Check distance from point to the line segment
    const x1 = this.x,
      y1 = this.y;
    const x2 = this.x + this.width,
      y2 = this.y + this.height;

    const L = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    if (L === 0)
      return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2) < this.strokeWidth;

    const t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / (L * L);
    const t_clamped = Math.max(0, Math.min(1, t));

    const closestX = x1 + t_clamped * (x2 - x1);
    const closestY = y1 + t_clamped * (y2 - y1);

    const distance = Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);

    // Check if the distance is within the line's thickness
    return distance <= this.strokeWidth / 2 + 2; // +2 for easier selection
  }
}
