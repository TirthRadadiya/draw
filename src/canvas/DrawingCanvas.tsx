import React, { useRef, useState } from "react";
import { useShapes } from "../state/ShapesContext";
import { useTool } from "../state/ToolContext";
import Rectangle from "../shapes/Rectangle";
import Ellipse from "../shapes/Ellipse";
import Arrow from "../shapes/Arrow";
import Draw from "../shapes/Draw";
import type {
  RectangleShape,
  EllipseShape,
  ArrowShape,
  DrawShape,
  AnyShape,
} from "../types/shapes";
import { randomId } from "../utils/randomId";
import ShapePropertiesPanel from "../components/ShapePropertiesPanel";
import Toolbar from "../components/Toolbar";

const DrawingCanvas: React.FC = () => {
  const { shapes, setShapes } = useShapes();
  const { tool } = useTool();
  const [drawing, setDrawing] = useState<AnyShape | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );
  const [resizing, setResizing] = useState<null | {
    id: string;
    corner: "br" | "tr" | "bl" | "tl" | "rx" | "ry" | "start" | "end";
  }>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Utility to get pointer position (no pan)
  const getPointerPos = (e: React.PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // If middle mouse, let pan handler take over
    if (tool === "select" && e.button === 1) return;
    const { x, y } = getPointerPos(e);
    if (tool === "select") {
      // Check if a shape is under the pointer
      const found = [...shapes].reverse().find((shape) => {
        if (shape.type === "rectangle") {
          return (
            x >= shape.x &&
            x <= shape.x + shape.width &&
            y >= shape.y &&
            y <= shape.y + shape.height
          );
        }
        if (shape.type === "ellipse") {
          return (
            (x - shape.x) ** 2 / shape.rx ** 2 +
              (y - shape.y) ** 2 / shape.ry ** 2 <=
            1
          );
        }
        if (shape.type === "arrow") {
          // Improved hit test: check if pointer is near the line segment
          const distToSegment = (
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            px: number,
            py: number
          ) => {
            const dx = x2 - x1;
            const dy = y2 - y1;
            if (dx === 0 && dy === 0) return Math.hypot(px - x1, py - y1);
            const t = Math.max(
              0,
              Math.min(
                1,
                ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)
              )
            );
            const projX = x1 + t * dx;
            const projY = y1 + t * dy;
            return Math.hypot(px - projX, py - projY);
          };
          return distToSegment(shape.x, shape.y, shape.x2, shape.y2, x, y) < 10;
        }
        if (shape.type === "draw") {
          // Hit test: near any point in the path
          return shape.points.some(
            ([px, py]) => Math.hypot(x - px, y - py) < 8
          );
        }
        return false;
      });
      if (found) {
        setSelectedId(found.id);
        setDragOffset({ x: x - found.x, y: y - found.y });
      } else {
        setSelectedId(null);
        setDragOffset(null);
      }
      return;
    }
    if (tool === "rectangle") {
      setDrawing({
        id: randomId(),
        type: "rectangle",
        x,
        y,
        width: 0,
        height: 0,
        fill: "none",
        stroke: "#fff", // white border by default
      });
    } else if (tool === "ellipse") {
      setDrawing({
        id: randomId(),
        type: "ellipse",
        x,
        y,
        rx: 0,
        ry: 0,
        fill: "none",
        stroke: "#fff", // white border by default
      });
    } else if (tool === "arrow") {
      setDrawing({
        id: randomId(),
        type: "arrow",
        x,
        y,
        x2: x,
        y2: y,
        fill: "none",
        stroke: "#fff", // white border by default
      });
    } else if (tool === "draw") {
      setDrawing({
        id: randomId(),
        type: "draw",
        x,
        y,
        points: [[x, y]],
        fill: "none",
        stroke: "#fff", // white border by default
      });
    }
  };

  const handleResizePointerDown = (
    e: React.PointerEvent,
    id: string,
    corner: "br" | "tr" | "bl" | "tl" | "rx" | "ry" | "start" | "end"
  ) => {
    e.stopPropagation();
    setSelectedId(id);
    setResizing({ id, corner });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (tool === "select" && selectedId && dragOffset && !resizing) {
      const { x, y } = getPointerPos(e);
      setShapes((prev) =>
        prev.map((shape) => {
          if (shape.id !== selectedId) return shape;
          if (
            shape.type === "rectangle" ||
            shape.type === "ellipse" ||
            shape.type === "arrow" ||
            shape.type === "draw"
          ) {
            return { ...shape, x: x - dragOffset.x, y: y - dragOffset.y };
          }
          return shape;
        })
      );
      return;
    }
    if (tool === "select" && resizing) {
      const { x, y } = getPointerPos(e);
      setShapes((prev) =>
        prev.map((shape) => {
          if (shape.id !== resizing.id) return shape;
          if (shape.type === "rectangle") {
            let newX = shape.x,
              newY = shape.y,
              newW = shape.width,
              newH = shape.height;
            if (resizing.corner === "br") {
              newW = x - shape.x;
              newH = y - shape.y;
            } else if (resizing.corner === "tr") {
              newW = x - shape.x;
              newY = y;
              newH = shape.y + shape.height - y;
            } else if (resizing.corner === "bl") {
              newX = x;
              newW = shape.x + shape.width - x;
              newH = y - shape.y;
            } else if (resizing.corner === "tl") {
              newX = x;
              newY = y;
              newW = shape.x + shape.width - x;
              newH = shape.y + shape.height - y;
            }
            return { ...shape, x: newX, y: newY, width: newW, height: newH };
          }
          if (shape.type === "ellipse") {
            let newRx = shape.rx,
              newRy = shape.ry,
              newX = shape.x,
              newY = shape.y;
            if (resizing.corner === "rx") {
              newRx = x - shape.x;
            } else if (resizing.corner === "ry") {
              newRy = y - shape.y;
            } else if (resizing.corner === "tl") {
              newX = x;
              newY = y;
              newRx = Math.abs(shape.x + shape.rx - x);
              newRy = Math.abs(shape.y + shape.ry - y);
            }
            return { ...shape, x: newX, y: newY, rx: newRx, ry: newRy };
          }
          if (shape.type === "arrow") {
            if (resizing.corner === "start") {
              return { ...shape, x, y };
            } else if (resizing.corner === "end") {
              return { ...shape, x2: x, y2: y };
            }
          }
          return shape;
        })
      );
      return;
    }
    if (!drawing) return;
    const { x, y } = getPointerPos(e);
    if (drawing.type === "rectangle") {
      setDrawing({ ...drawing, width: x - drawing.x, height: y - drawing.y });
    } else if (drawing.type === "ellipse") {
      setDrawing({ ...drawing, rx: x - drawing.x, ry: y - drawing.y });
    } else if (drawing.type === "arrow") {
      setDrawing({ ...drawing, x2: x, y2: y });
    } else if (drawing.type === "draw") {
      setDrawing({ ...drawing, points: [...drawing.points, [x, y]] });
    }
  };

  const handlePointerUp = () => {
    setDragOffset(null);
    setResizing(null);
    if (drawing) {
      setShapes((prev) => [...prev, drawing]);
      setDrawing(null);
    }
  };

  // Handler to update selected shape's properties
  const handleShapePropsChange = (updates: Partial<AnyShape>) => {
    if (!selectedId) return;
    setShapes((prev) =>
      prev.map((shape) => {
        if (shape.id !== selectedId) return shape;
        // Only allow updating style/color properties, not type
        const { type, ...rest } = updates;
        void type;
        return { ...shape, ...rest };
      })
    );
  };

  // Delete selected shape with Delete or Backspace key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        setShapes((prev) => prev.filter((shape) => shape.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, setShapes]);

  // Layer (z-order) helpers
  const selectedIndex = selectedId
    ? shapes.findIndex((s) => s.id === selectedId)
    : -1;
  const canBringForward =
    selectedIndex > -1 && selectedIndex < shapes.length - 1;
  const canSendBackward = selectedIndex > 0;

  const bringForward = () => {
    if (!canBringForward) return;
    setShapes((prev) => {
      const arr = [...prev];
      const idx = selectedIndex;
      if (idx < 0 || idx >= arr.length - 1) return arr;
      const temp = arr[idx];
      arr[idx] = arr[idx + 1];
      arr[idx + 1] = temp;
      return arr;
    });
  };
  const sendBackward = () => {
    if (!canSendBackward) return;
    setShapes((prev) => {
      const arr = [...prev];
      const idx = selectedIndex;
      if (idx <= 0) return arr;
      const temp = arr[idx];
      arr[idx] = arr[idx - 1];
      arr[idx - 1] = temp;
      return arr;
    });
  };

  return (
    <div className="flex-1 bg-black w-full h-full relative cursor-crosshair">
      <Toolbar
        onBringForward={bringForward}
        onSendBackward={sendBackward}
        canBringForward={canBringForward}
        canSendBackward={canSendBackward}
      />
      <div className="absolute top-4 right-4 z-20">
        {selectedId && (
          <ShapePropertiesPanel
            shape={shapes.find((s) => s.id === selectedId)!}
            onChange={handleShapePropsChange}
            layerIndex={selectedIndex}
            totalLayers={shapes.length}
          />
        )}
      </div>
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full touch-none select-none"
        style={{ cursor: tool === "pan" ? "grab" : "default" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        <g>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#fff" />
            </marker>
          </defs>
          {shapes.map((shape) => {
            const isSelected = shape.id === selectedId;
            if (shape.type === "rectangle") {
              return (
                <g key={shape.id}>
                  <Rectangle shape={{ ...shape, selected: isSelected }} />
                  {isSelected && (
                    <>
                      {(["tl", "tr", "bl", "br"] as const).map((corner) => {
                        let cx = shape.x,
                          cy = shape.y;
                        if (corner === "tr") {
                          cx = shape.x + shape.width;
                          cy = shape.y;
                        }
                        if (corner === "bl") {
                          cx = shape.x;
                          cy = shape.y + shape.height;
                        }
                        if (corner === "br") {
                          cx = shape.x + shape.width;
                          cy = shape.y + shape.height;
                        }
                        return (
                          <circle
                            key={corner}
                            cx={cx}
                            cy={cy}
                            r={7}
                            className="fill-gray-900 stroke-cyan-400 stroke-2 cursor-nwse-resize shadow-lg"
                            onPointerDown={(e) =>
                              handleResizePointerDown(e, shape.id, corner)
                            }
                          />
                        );
                      })}
                    </>
                  )}
                </g>
              );
            }
            if (shape.type === "ellipse") {
              return (
                <g key={shape.id}>
                  <Ellipse shape={{ ...shape, selected: isSelected }} />
                  {isSelected && (
                    <>
                      <circle
                        cx={shape.x + shape.rx}
                        cy={shape.y}
                        r={7}
                        className="fill-gray-900 stroke-cyan-400 stroke-2 cursor-ew-resize shadow-lg"
                        onPointerDown={(e) =>
                          handleResizePointerDown(e, shape.id, "rx")
                        }
                      />
                      <circle
                        cx={shape.x}
                        cy={shape.y + shape.ry}
                        r={7}
                        className="fill-gray-900 stroke-cyan-400 stroke-2 cursor-ns-resize shadow-lg"
                        onPointerDown={(e) =>
                          handleResizePointerDown(e, shape.id, "ry")
                        }
                      />
                      <circle
                        cx={shape.x - shape.rx}
                        cy={shape.y - shape.ry}
                        r={7}
                        className="fill-gray-900 stroke-cyan-400 stroke-2 cursor-nwse-resize shadow-lg"
                        onPointerDown={(e) =>
                          handleResizePointerDown(e, shape.id, "tl")
                        }
                      />
                    </>
                  )}
                </g>
              );
            }
            if (shape.type === "arrow") {
              // Define a unique marker for each arrow to match its stroke color
              const markerId = `arrowhead-${shape.id}`;
              return (
                <g key={shape.id}>
                  <defs>
                    <marker
                      id={markerId}
                      markerWidth="10"
                      markerHeight="7"
                      refX="10"
                      refY="3.5"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill={shape.stroke || "#fff"}
                      />
                    </marker>
                  </defs>
                  <Arrow
                    shape={{ ...shape, selected: isSelected }}
                    markerId={markerId}
                  />
                  {isSelected && (
                    <>
                      <circle
                        cx={shape.x}
                        cy={shape.y}
                        r={7}
                        className="fill-gray-900 stroke-cyan-400 stroke-2 cursor-pointer shadow-lg"
                        onPointerDown={(e) =>
                          handleResizePointerDown(e, shape.id, "start")
                        }
                      />
                      <circle
                        cx={shape.x2}
                        cy={shape.y2}
                        r={7}
                        className="fill-gray-900 stroke-cyan-400 stroke-2 cursor-pointer shadow-lg"
                        onPointerDown={(e) =>
                          handleResizePointerDown(e, shape.id, "end")
                        }
                      />
                    </>
                  )}
                </g>
              );
            }
            if (shape.type === "draw") {
              return (
                <Draw
                  key={shape.id}
                  shape={{ ...shape, selected: isSelected }}
                />
              );
            }
            return null;
          })}
          {drawing &&
            (() => {
              if (drawing.type === "rectangle")
                return <Rectangle shape={drawing as RectangleShape} />;
              if (drawing.type === "ellipse")
                return <Ellipse shape={drawing as EllipseShape} />;
              if (drawing.type === "arrow")
                return <Arrow shape={drawing as ArrowShape} />;
              if (drawing.type === "draw")
                return <Draw shape={drawing as DrawShape} />;
              return null;
            })()}
        </g>
      </svg>
    </div>
  );
};

export default DrawingCanvas;
