import React from 'react';
import type { ArrowShape } from '../types/shapes';

const Arrow: React.FC<{ shape: ArrowShape; markerId?: string }> = ({ shape, markerId }) => {
  let dashArray = '';
  if (shape.strokeDasharray === 'dashed') dashArray = '8,4';
  if (shape.strokeDasharray === 'dotted') dashArray = '2,4';
  return (
    <line
      x1={shape.x}
      y1={shape.y}
      x2={shape.x2}
      y2={shape.y2}
      stroke={shape.stroke || '#000'}
      strokeWidth={typeof shape.strokeWidth === 'number' ? shape.strokeWidth : 2}
      strokeDasharray={dashArray}
      markerEnd={markerId ? `url(#${markerId})` : 'url(#arrowhead)'}
    />
  );
};

export default Arrow;
