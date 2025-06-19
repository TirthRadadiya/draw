import React from "react";
import { useTool, type ToolType } from "../state/ToolContext";
import { FaArrowUp, FaArrowDown, FaHandPointUp } from "react-icons/fa";
import { GiArrowCursor } from "react-icons/gi";
import { useShapes } from "../state/ShapesContext";

const tools: { label: string; value: ToolType; icon: React.ReactNode }[] = [
  {
    label: "Select",
    value: "select",
    icon: <GiArrowCursor />,
  },
  {
    label: "Pan",
    value: "pan",
    icon: <FaHandPointUp className="text-yellow-400" size={32} />,
  },
  {
    label: "Draw",
    value: "draw",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-green-600"
      >
        <path d="M4 16c4-8 8 8 12-8" />
      </svg>
    ),
  },
  {
    label: "Rectangle",
    value: "rectangle",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-amber-600"
      >
        <rect x="4" y="4" width="14" height="14" />
      </svg>
    ),
  },
  {
    label: "Ellipse",
    value: "ellipse",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-purple-600"
      >
        <ellipse cx="11" cy="11" rx="7" ry="5" />
      </svg>
    ),
  },
  {
    label: "Arrow",
    value: "arrow",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-red-600"
      >
        <line x1="4" y1="18" x2="18" y2="4" />
        <polygon
          points="18,4 13,7 15,9"
          fill="currentColor"
          className="text-red-600"
        />
      </svg>
    ),
  },
];

interface ToolbarProps {
  onBringForward: () => void;
  onSendBackward: () => void;
  canBringForward: boolean;
  canSendBackward: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onBringForward,
  onSendBackward,
  canBringForward,
  canSendBackward,
}) => {
  const { tool, setTool } = useTool();
  const { shapes, setShapes } = useShapes();

  // Save drawing as JSON
  const handleSave = () => {
    const dataStr = JSON.stringify(shapes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drawing.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Load drawing from JSON
  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loadedShapes = JSON.parse(event.target?.result as string);
        if (Array.isArray(loadedShapes)) {
          setShapes(loadedShapes);
        } else {
          alert("Invalid drawing file.");
        }
      } catch {
        alert("Failed to load drawing.");
      }
    };
    reader.readAsText(file);
    // Reset input value so the same file can be loaded again
    e.target.value = "";
  };

  return (
    <div className="fixed top-1/2 left-4 -translate-y-1/2 z-30 flex flex-col gap-3 bg-black/70 backdrop-blur border border-cyan-500 rounded-2xl shadow-2xl items-center py-3">
      {tools.map(({ label, value, icon }) => (
        <button
          key={value}
          title={label}
          className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-150 border-2 p-0 ${
            tool === value
              ? "bg-cyan-500 text-white border-cyan-400 scale-110 shadow-lg"
              : "bg-gray-800 text-cyan-200 border-transparent hover:bg-cyan-900 hover:scale-105"
          } focus:outline-none focus:ring-2 focus:ring-cyan-400`}
          onClick={() => setTool(value)}
        >
          {icon}
        </button>
      ))}
      {/* Layer controls */}
      <h2 className="mt-5">
        Layer <br />
        Control
      </h2>
      <div className="flex flex-col gap-2">
        <button
          title="Bring Forward"
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800 text-cyan-200 border-2 border-transparent hover:bg-cyan-900 hover:text-cyan-400 transition disabled:opacity-40 p-4"
          disabled={!canBringForward}
          onClick={onBringForward}
        >
          <FaArrowUp size={20} />
        </button>
        <button
          title="Send Backward"
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800 text-cyan-200 border-2 border-transparent hover:bg-cyan-900 hover:text-cyan-400 transition disabled:opacity-40 p-4"
          disabled={!canSendBackward}
          onClick={onSendBackward}
        >
          <FaArrowDown size={20} />
        </button>
      </div>
      {/* Save/Load Drawing Buttons */}
      <div className="flex flex-col gap-2 mt-6">
        <button
          title="Save Drawing"
          className="flex items-center justify-center w-fit h-10 rounded-xl bg-cyan-700 text-white border-2 border-cyan-400 hover:bg-cyan-900 hover:text-cyan-200 transition p-2 mx-auto"
          onClick={handleSave}
        >
          Save
        </button>
        <label className="flex flex-col items-center cursor-pointer w-28 mx-auto">
          <span className="flex items-center justify-center w-fit h-10 rounded-xl bg-cyan-700 text-white border-2 border-cyan-400 hover:bg-cyan-900 hover:text-cyan-200 transition p-2 text-center">
            Load
          </span>
          <input
            type="file"
            accept="application/json"
            onChange={handleLoad}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default Toolbar;
