import React, { useState, useCallback } from "react";
import { Toolbar } from "./components/Toolbar";
import { Canvas } from "./components/Canvas";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { Shape } from "./models/Shape";
import type { Tool, ShapeObject } from "./types/types";
import { createShapeFromObject } from "./utils/shapeFactory";

const App: React.FC = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  const handleAddShape = useCallback((newShape: Shape) => {
    setShapes((prevShapes) => [...prevShapes, newShape]);
    setActiveTool("select");
    setSelectedShapeId(newShape.id);
  }, []);

  const handleUpdateShape = useCallback((updatedShape: Shape) => {
    setShapes((prevShapes) =>
      prevShapes.map((s) => (s.id === updatedShape.id ? updatedShape : s))
    );
  }, []);

  const handleSelectShape = useCallback((id: string | null) => {
    setSelectedShapeId(id);
    if (id) {
      setActiveTool("select");
    }
  }, []);

  const handleSave = () => {
    try {
      const shapeObjects = shapes.map((shape) => shape.toObject());
      const json = JSON.stringify(shapeObjects, null, 2);
      localStorage.setItem("drawing", json);
      alert("Drawing saved successfully!");
    } catch (error) {
      console.error("Failed to save drawing:", error);
      alert("Error saving drawing. See console for details.");
    }
  };

  const handleLoad = () => {
    try {
      const json = localStorage.getItem("drawing");
      if (json) {
        const shapeObjects: ShapeObject[] = JSON.parse(json);
        const loadedShapes = shapeObjects.map((obj) =>
          createShapeFromObject(obj)
        );
        setShapes(loadedShapes);
        setSelectedShapeId(null);
        alert("Drawing loaded successfully!");
      } else {
        alert("No saved drawing found.");
      }
    } catch (error) {
      console.error("Failed to load drawing:", error);
      alert("Error loading drawing. See console for details.");
    }
  };

  const selectedShape = shapes.find((s) => s.id === selectedShapeId) || null;

  return (
    <div className="h-screen w-screen bg-gray-900 font-sans text-gray-100 relative overflow-hidden flex">
      <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        onSave={handleSave}
        onLoad={handleLoad}
      />

      <PropertiesPanel
        selectedShape={selectedShape}
        onUpdateShape={handleUpdateShape}
      />
      <main className="w-full h-full">
        <Canvas
          shapes={shapes}
          activeTool={activeTool}
          selectedShapeId={selectedShapeId}
          onAddShape={handleAddShape}
          onUpdateShape={handleUpdateShape}
          onSelectShape={handleSelectShape}
        />
      </main>
    </div>
  );
};

export default App;
