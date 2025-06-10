import type { ShapeObject, StrokeStyle } from "../types/types";

export abstract class Shape {
  id: string;
  type: "rectangle" | "circle" | "line";
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor?: string;
  strokeColor: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;

  constructor(config: ShapeObject) {
    this.id = config.id || `shape_${Date.now()}_${Math.random()}`;
    this.type = config.type;
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.fillColor = config.fillColor;
    this.strokeColor = config.strokeColor;
    this.strokeWidth = config.strokeWidth;
    this.strokeStyle = config.strokeStyle;
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract isPointInside(x: number, y: number): boolean;

  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  getBoudingBox() {
    return {
      x: this.width < 0 ? this.x + this.width : this.x,
      y: this.height < 0 ? this.y + this.height : this.y,
      width: Math.abs(this.width),
      height: Math.abs(this.height),
    };
  }

  toObject(): ShapeObject {
    return {
      id: this.id,
      type: this.type,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      strokeStyle: this.strokeStyle,
    };
  }

  protected applyStyles(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = this.strokeWidth;
    if (this.fillColor) {
      ctx.fillStyle = this.fillColor;
    }

    switch (this.strokeStyle) {
      case "dashed":
        ctx.setLineDash([10, 10]);
        break;
      case "dotted":
        ctx.setLineDash([3, 6]);
        break;
      case "solid":
      default:
        ctx.setLineDash([]);
        break;
    }
  }
}
