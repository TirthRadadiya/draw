import React from "react";
import type { AnyShape } from "../types/shapes";

interface ShapePropertiesPanelProps {
  shape: AnyShape;
  onChange: (updates: Partial<AnyShape>) => void;
}

const borderStyles = [
  { label: "Solid", value: "solid" },
  { label: "Dashed", value: "dashed" },
  { label: "Dotted", value: "dotted" },
];

const ShapePropertiesPanel: React.FC<
  ShapePropertiesPanelProps & { layerIndex?: number; totalLayers?: number }
> = ({ shape, onChange, layerIndex, totalLayers }) => {
  const borderStyle = shape.strokeDasharray || "solid";
  const borderWidth =
    typeof shape.strokeWidth === "number" ? shape.strokeWidth : 2;
  const fillOpacity =
    "fillOpacity" in shape && typeof shape.fillOpacity === "number"
      ? shape.fillOpacity
      : 1;

  return (
    <div className="p-3 bg-black/80 backdrop-blur border border-cyan-500 rounded-xl shadow-2xl w-56 flex flex-col gap-3 text-cyan-100">
      {typeof layerIndex === "number" && typeof totalLayers === "number" && (
        <div className="text-xs text-cyan-400 text-center mb-2">
          Layer: {layerIndex + 1} of {totalLayers}
        </div>
      )}
      <label className="flex flex-col gap-1">
        <span className="text-xs text-cyan-300">Border Width</span>
        <input
          type="range"
          min={1}
          max={16}
          value={borderWidth}
          onChange={(e) => onChange({ strokeWidth: Number(e.target.value) })}
          className="w-full accent-cyan-400"
        />
        <div className="flex justify-between text-xs text-cyan-500">
          <span>1</span>
          <span>16</span>
        </div>
        <div className="text-xs text-center font-mono mt-1 text-cyan-300">
          {borderWidth}px
        </div>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-cyan-300">Border Color</span>
        <input
          type="color"
          value={shape.stroke || "#000000"}
          onChange={(e) => onChange({ stroke: e.target.value })}
          className="w-8 h-8 p-0 border-none bg-transparent rounded-full shadow-md"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-cyan-300">Border Style</span>
        <select
          value={borderStyle}
          onChange={(e) =>
            onChange({
              strokeDasharray: e.target.value as "solid" | "dashed" | "dotted",
            })
          }
          className="border rounded px-2 py-1 bg-gray-900 text-cyan-200 border-cyan-700 focus:ring-2 focus:ring-cyan-400"
        >
          {borderStyles.map((style) => (
            <option key={style.value} value={style.value}>
              {style.label}
            </option>
          ))}
        </select>
      </label>
      {"fill" in shape && (
        <label className="flex flex-col gap-1">
          <span className="text-xs text-cyan-300">Background Color</span>
          <input
            type="color"
            value={shape.fill || "#ffffff"}
            onChange={(e) => onChange({ fill: e.target.value })}
            className="w-8 h-8 p-0 border-none bg-transparent rounded-full shadow-md"
          />
          <span className="text-xs text-cyan-300 mt-2">Background Opacity</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={fillOpacity}
            onChange={(e) => onChange({ fillOpacity: Number(e.target.value) })}
            className="w-full accent-cyan-400"
          />
          <div className="text-xs text-center font-mono mt-1 text-cyan-300">
            {Math.round(fillOpacity * 100)}%
          </div>
        </label>
      )}
    </div>
  );
};

export default ShapePropertiesPanel;
