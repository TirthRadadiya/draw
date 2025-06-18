import React from "react";
import type { Tool } from "../types/types";
import {
  FaMousePointer,
  FaRegSquare,
  FaRegCircle,
  FaSlash,
  FaSave,
  FaFolderOpen,
} from "react-icons/fa";

interface ToolbarProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  onSave: () => void;
  onLoad: () => void;
}

const tools: { name: Tool; icon: React.ReactNode }[] = [
  { name: "select", icon: <FaMousePointer /> },
  { name: "rectangle", icon: <FaRegSquare /> },
  { name: "circle", icon: <FaRegCircle /> },
  { name: "line", icon: <FaSlash /> },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  setActiveTool,
  onSave,
  onLoad,
}) => {
  const buttonBaseClass =
    "w-11 h-11 flex flex-col justify-center items-center rounded-md transition-colors duration-150";
  const inactiveClass = "text-gray-300 hover:bg-gray-700";
  const activeClass = "bg-blue-600 text-white";

  return (
    <div className="absolute top-20 left-4 flex flex-col gap-1 p-1.5 rounded-lg bg-[#202020] shadow-2xl border border-gray-700/50">
      {tools.map(({ name, icon }) => {
        const isActive = activeTool === name;
        return (
          <button
            key={name}
            onClick={() => setActiveTool(name)}
            className={`${buttonBaseClass} ${
              isActive ? activeClass : inactiveClass
            }`}
            title={`${name.charAt(0).toUpperCase() + name.slice(1)}`}
          >
            <div className="text-lg">{icon}</div>
          </button>
        );
      })}

      <div className="h-[1px] bg-gray-600 mx-1 my-1"></div>

      <button
        onClick={onSave}
        title="Save (Ctrl+S)"
        className={`${buttonBaseClass} ${inactiveClass}`}
      >
        <div className="text-lg">
          <FaSave />
        </div>
      </button>
      <button
        onClick={onLoad}
        title="Load (Ctrl+O)"
        className={`${buttonBaseClass} ${inactiveClass}`}
      >
        <div className="text-lg">
          <FaFolderOpen />
        </div>
      </button>
    </div>
  );
};
