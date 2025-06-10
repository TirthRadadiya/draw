// src/components/Canvas.tsx
import React, { useRef, useEffect, useState } from "react";
import { Shape } from "../models/Shape";
import type { Tool, HandlePosition } from "../types/types";
import { createShapeFromObject } from "../utils/shapeFactory";
import { Rectangle } from "../models/Rectangle";
import { Circle } from "../models/Circle";
import { Line } from "../models/Line";
import {
  getHandlesForShape,
  getHandleAtPosition,
  getCursorForHandle,
  HANDLE_SIZE,
} from "../utils/handleUtils";

interface CanvasProps {
  shapes: Shape[];
  activeTool: Tool;
  selectedShapeId: string | null;
  onAddShape: (shape: Shape) => void;
  onUpdateShape: (updatedShape: Shape) => void;
  onSelectShape: (id: string | null) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  shapes,
  activeTool,
  selectedShapeId,
  onAddShape,
  onUpdateShape,
  onSelectShape,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [resizingHandle, setResizingHandle] = useState<HandlePosition | null>(
    null
  );
  const [shapeBeingResized, setShapeBeingResized] = useState<Shape | null>(
    null
  );
  const [cursor, setCursor] = useState("default");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      setDimensions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const getMousePos = (e: React.MouseEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    setStartPoint(pos);

    if (activeTool === "select") {
      const selectedShape = shapes.find((s) => s.id === selectedShapeId);
      if (selectedShape) {
        const handle = getHandleAtPosition(pos, selectedShape);
        if (handle) {
          setResizingHandle(handle);
          setShapeBeingResized(selectedShape);
          return;
        }
      }

      const shapeToSelect = [...shapes]
        .reverse()
        .find((shape) => shape.isPointInside(pos.x, pos.y));
      if (shapeToSelect) {
        onSelectShape(shapeToSelect.id);
        setIsDragging(true);
      } else {
        onSelectShape(null);
      }
    } else {
      setIsDrawing(true);
      const commonProps = {
        id: `shape_${Date.now()}`,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        strokeColor: "#E5E7EB", // gray-200
        strokeWidth: 2,
        strokeStyle: "solid" as const,
      };
      let newShape: Shape | null = null;
      if (activeTool === "rectangle")
        newShape = new Rectangle({ ...commonProps, fillColor: "#374151" }); // gray-700
      if (activeTool === "circle")
        newShape = new Circle({ ...commonProps, fillColor: "#374151" });
      if (activeTool === "line") newShape = new Line(commonProps);
      setCurrentShape(newShape);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    const selectedShape = shapes.find((s) => s.id === selectedShapeId);

    if (resizingHandle && shapeBeingResized && startPoint) {
      const dx = pos.x - startPoint.x;
      const dy = pos.y - startPoint.y;

      const updatedData = shapeBeingResized.toObject();
      const original = shapeBeingResized.toObject();

      switch (resizingHandle) {
        case "topLeft":
          updatedData.x = original.x + dx;
          updatedData.y = original.y + dy;
          updatedData.width = original.width - dx;
          updatedData.height = original.height - dy;
          break;
        case "topRight":
          updatedData.y = original.y + dy;
          updatedData.width = original.width + dx;
          updatedData.height = original.height - dy;
          break;
        case "bottomLeft":
          updatedData.x = original.x + dx;
          updatedData.width = original.width - dx;
          updatedData.height = original.height + dy;
          break;
        case "bottomRight":
          updatedData.width = original.width + dx;
          updatedData.height = original.height + dy;
          break;
        case "top":
          updatedData.y = original.y + dy;
          updatedData.height = original.height - dy;
          break;
        case "bottom":
          updatedData.height = original.height + dy;
          break;
        case "left":
          updatedData.x = original.x + dx;
          updatedData.width = original.width - dx;
          break;
        case "right":
          updatedData.width = original.width + dx;
          break;
        case "start":
          updatedData.x = original.x + dx;
          updatedData.y = original.y + dy;
          updatedData.width = original.width - dx;
          updatedData.height = original.height - dy;
          break;
        case "end":
          updatedData.width = original.width + dx;
          updatedData.height = original.height + dy;
          break;
      }
      onUpdateShape(createShapeFromObject(updatedData));
      return;
    }

    if (activeTool === "select" && selectedShape) {
      const handle = getHandleAtPosition(pos, selectedShape);
      setCursor(handle ? getCursorForHandle(handle) : "move");
    } else {
      setCursor(activeTool === "select" ? "default" : "crosshair");
    }

    if (isDragging && selectedShape && startPoint) {
      const dx = pos.x - startPoint.x;
      const dy = pos.y - startPoint.y;
      const newInstance = createShapeFromObject(selectedShape.toObject());
      newInstance.move(dx, dy);
      onUpdateShape(newInstance);
      setStartPoint(pos);
    } else if (isDrawing && currentShape) {
      const dx = pos.x - (startPoint?.x || 0);
      const dy = pos.y - (startPoint?.y || 0);
      const shapeData = currentShape.toObject();
      shapeData.width = dx;
      shapeData.height = dy;
      setCurrentShape(createShapeFromObject(shapeData));
    }
  };

  const handleMouseUp = () => {
    if (resizingHandle) {
      const shape = shapes.find((s) => s.id === selectedShapeId);
      if (shape) {
        const finalData = shape.toObject();
        // Normalize shape after resize
        const box = shape.getBoudingBox();
        finalData.x = box.x;
        finalData.y = box.y;
        finalData.width = box.width;
        finalData.height = box.height;
        onUpdateShape(createShapeFromObject(finalData));
      }
    }

    if (isDrawing && currentShape) {
      const finalShapeData = currentShape.toObject();
      const box = currentShape.getBoudingBox();
      finalShapeData.x = box.x;
      finalShapeData.y = box.y;
      finalShapeData.width = box.width;
      finalShapeData.height = box.height;

      const finalShape = createShapeFromObject(finalShapeData);

      if (finalShape.width > 0 || finalShape.height > 0) onAddShape(finalShape);
    }

    setIsDrawing(false);
    setIsDragging(false);
    setResizingHandle(null);
    setShapeBeingResized(null);
    setStartPoint(null);
    setCurrentShape(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const { width, height } = dimensions;
    if (!canvas || width === 0 || height === 0) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    shapes.forEach((shape) => shape.draw(ctx));
    if (currentShape) currentShape.draw(ctx);

    const selectedShape = shapes.find((s) => s.id === selectedShapeId);
    if (selectedShape) {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.9)";
      ctx.lineWidth = 1.5;

      const padding = 5;
      const { x, y, width: w, height: h } = selectedShape.getBoudingBox();
      ctx.strokeRect(
        x - padding,
        y - padding,
        w + padding * 2,
        h + padding * 2
      );

      const handles = getHandlesForShape(selectedShape);
      ctx.fillStyle = "white";
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      handles.forEach((handle) => {
        ctx.fillRect(
          handle.x - HANDLE_SIZE / 2,
          handle.y - HANDLE_SIZE / 2,
          HANDLE_SIZE,
          HANDLE_SIZE
        );
        ctx.strokeRect(
          handle.x - HANDLE_SIZE / 2,
          handle.y - HANDLE_SIZE / 2,
          HANDLE_SIZE,
          HANDLE_SIZE
        );
      });
    }
  }, [shapes, selectedShapeId, currentShape, dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas
        ref={canvasRef}
        style={{ cursor, display: "block", height: '90vh' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};
