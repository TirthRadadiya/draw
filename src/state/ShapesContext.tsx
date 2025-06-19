import React, { createContext, useContext, useState } from 'react';
import type { AnyShape } from '../types/shapes';

interface ShapesContextType {
  shapes: AnyShape[];
  setShapes: React.Dispatch<React.SetStateAction<AnyShape[]>>;
}

const ShapesContext = createContext<ShapesContextType | undefined>(undefined);

export const ShapesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shapes, setShapes] = useState<AnyShape[]>([]);
  return (
    <ShapesContext.Provider value={{ shapes, setShapes }}>
      {children}
    </ShapesContext.Provider>
  );
};

export const useShapes = () => {
  const context = useContext(ShapesContext);
  if (!context) throw new Error('useShapes must be used within a ShapesProvider');
  return context;
};
