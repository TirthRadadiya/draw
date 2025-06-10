import React from "react";
import { Shape } from "../models/Shape";
import type { StrokeStyle } from "../types/types";
import { createShapeFromObject } from "../utils/shapeFactory";

interface PropertiesPanelProps {
  selectedShape: Shape | null;
  onUpdateShape: (updatedShape: Shape) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedShape,
  onUpdateShape,
}) => {
  const handlePropertyChange = (property: keyof Shape, value: any) => {
    if (!selectedShape) return;
    const shapeData = selectedShape.toObject();
    (shapeData as any)[property] = value;
    const newInstance = createShapeFromObject(shapeData);
    onUpdateShape(newInstance);
  };

  const strokeStyles: StrokeStyle[] = ["solid", "dashed", "dotted"];

  return (
    <div
      className={`absolute top-0 left-0 flex items-center gap-4 p-2 rounded-lg bg-[#202020] shadow-2xl border border-gray-700/50 transition-all duration-300 ${
        selectedShape
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-16 pointer-events-none"
      }`}
    >
      {selectedShape && (
        <>
          {selectedShape.fillColor !== undefined && (
            <div className="flex items-center gap-2" title="Fill Color">
              <input
                type="color"
                value={selectedShape.fillColor || "#374151"}
                onChange={(e) =>
                  handlePropertyChange("fillColor", e.target.value)
                }
                className="w-6 h-6 p-0 appearance-none border-none rounded cursor-pointer bg-transparent"
              />
            </div>
          )}

          <div className="w-[1px] h-6 bg-gray-600"></div>

          <div className="flex items-center gap-2" title="Stroke Color">
            <input
              type="color"
              value={selectedShape.strokeColor}
              onChange={(e) =>
                handlePropertyChange("strokeColor", e.target.value)
              }
              className="w-6 h-6 p-0 appearance-none border-none rounded cursor-pointer bg-transparent"
            />
          </div>

          <div className="flex items-center gap-2" title="Stroke Width">
            <input
              type="range"
              min="1"
              max="50"
              value={selectedShape.strokeWidth}
              onChange={(e) =>
                handlePropertyChange(
                  "strokeWidth",
                  parseInt(e.target.value, 10)
                )
              }
              className="w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb-blue"
            />
          </div>

          <div className="flex items-center gap-2" title="Stroke Style">
            <select
              value={selectedShape.strokeStyle}
              onChange={(e) =>
                handlePropertyChange(
                  "strokeStyle",
                  e.target.value as StrokeStyle
                )
              }
              className="bg-gray-700 border-gray-600 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {strokeStyles.map((style) => (
                <option key={style} value={style} className="capitalize">
                  {style}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
};
