import React from 'react';
import type { RectangleShape } from '../types/shapes';

interface RectangleProps {
  shape: RectangleShape & { selected?: boolean };
}

const Rectangle: React.FC<RectangleProps> = ({ shape }) => {
  let dashArray = '';
  if (shape.strokeDasharray === 'dashed') dashArray = '8,4';
  if (shape.strokeDasharray === 'dotted') dashArray = '2,4';
  return (
    <rect
      x={shape.x}
      y={shape.y}
      width={shape.width}
      height={shape.height}
      fill={shape.fill}
      fillOpacity={typeof shape.fillOpacity === 'number' ? shape.fillOpacity : undefined}
      stroke={shape.selected ? shape.stroke || '#3b82f6' : shape.stroke || '#000'}
      strokeWidth={typeof shape.strokeWidth === 'number' ? shape.strokeWidth : (shape.selected ? 3 : 2)}
      strokeDasharray={dashArray}
      style={shape.selected ? { filter: 'drop-shadow(0 0 4px #3b82f6)' } : {}}
    />
  );
};

export default Rectangle;
