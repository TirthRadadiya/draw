import React from 'react';
import type { EllipseShape } from '../types/shapes';

const Ellipse: React.FC<{ shape: EllipseShape }> = ({ shape }) => {
  let dashArray = '';
  if (shape.strokeDasharray === 'dashed') dashArray = '8,4';
  if (shape.strokeDasharray === 'dotted') dashArray = '2,4';
  return (
    <ellipse
      cx={shape.x}
      cy={shape.y}
      rx={Math.abs(shape.rx)}
      ry={Math.abs(shape.ry)}
      fill={shape.fill}
      fillOpacity={typeof shape.fillOpacity === 'number' ? shape.fillOpacity : undefined}
      stroke={shape.stroke || '#000'}
      strokeWidth={typeof shape.strokeWidth === 'number' ? shape.strokeWidth : 2}
      strokeDasharray={dashArray}
    />
  );
};

export default Ellipse;
