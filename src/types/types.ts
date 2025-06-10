export type Tool = "select" | "rectangle" | "circle" | "line";
export type StrokeStyle = "solid" | "dashed" | "dotted";

// Interface for plain object representation for serialization (saving/loading)
export interface ShapeObject {
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
}
// type for the handling position
export type HandlePosition = 
  | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  | 'top' | 'right' | 'bottom' | 'left'
  | 'start' | 'end'; // For lines