export type ShapeType = 'rectangle' | 'ellipse' | 'arrow' | 'draw';

export interface BaseShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  fill: string;
  stroke: string;
}

export interface ShapeStyle {
  strokeWidth?: number;
  strokeDasharray?: 'solid' | 'dashed' | 'dotted';
}

export interface RectangleShape extends BaseShape, ShapeStyle {
  type: 'rectangle';
  width: number;
  height: number;
  selected?: boolean;
  fillOpacity?: number;
}

export interface EllipseShape extends BaseShape, ShapeStyle {
  type: 'ellipse';
  rx: number;
  ry: number;
  selected?: boolean;
  fillOpacity?: number;
}

export interface ArrowShape extends BaseShape, ShapeStyle {
  type: 'arrow';
  x2: number;
  y2: number;
  selected?: boolean;
  // No fillOpacity for arrows
}

export interface DrawShape extends BaseShape, ShapeStyle {
  type: 'draw';
  points: [number, number][];
  selected?: boolean;
  fillOpacity?: number;
}

export type AnyShape = RectangleShape | EllipseShape | ArrowShape | DrawShape;

export interface SelectableShape extends BaseShape {
  selected?: boolean;
}

// Add other shape types here
