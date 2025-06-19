import React, { createContext, useContext, useState } from 'react';

export type ToolType = 'select' | 'rectangle' | 'ellipse' | 'arrow' | 'draw' | 'pan';

interface ToolContextType {
  tool: ToolType;
  setTool: (tool: ToolType) => void;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export const ToolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tool, setTool] = useState<ToolType>('select');
  return (
    <ToolContext.Provider value={{ tool, setTool }}>
      {children}
    </ToolContext.Provider>
  );
};

export const useTool = () => {
  const context = useContext(ToolContext);
  if (!context) throw new Error('useTool must be used within a ToolProvider');
  return context;
};
