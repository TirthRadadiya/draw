import { Shape } from "../models/Shape";
import { Rectangle } from "../models/Rectangle";
import { Circle } from "../models/Circle";
import { Line } from "../models/Line";
import type { ShapeObject } from "../types/types";

export const createShapeFromObject = (obj: ShapeObject): Shape => {
  switch (obj.type) {
    case "rectangle":
      return new Rectangle({ ...obj, type: "rectangle" });
    case "circle":
      return new Circle({ ...obj, type: "circle" });
    case "line":
      return new Line({ ...obj, type: "line" });
    default:
      throw new Error(`Unknown shape type: ${obj.type}`);
  }
};
