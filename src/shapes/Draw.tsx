import React from 'react';
import type { DrawShape } from '../types/shapes';

const Draw: React.FC<{ shape: DrawShape }> = ({ shape }) => {
  const pathData = shape.points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  let dashArray = '';
  if (shape.strokeDasharray === 'dashed') dashArray = '8,4';
  if (shape.strokeDasharray === 'dotted') dashArray = '2,4';
  return <path d={pathData} fill="none" stroke={shape.stroke || '#000'} strokeWidth={typeof shape.strokeWidth === 'number' ? shape.strokeWidth : 2} strokeDasharray={dashArray} fillOpacity={typeof shape.fillOpacity === 'number' ? shape.fillOpacity : undefined} />;
};

export default Draw;
