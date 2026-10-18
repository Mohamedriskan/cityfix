import React from 'react';
import { Badge } from './Badge';

export const PriorityBadge = ({ priority, className = '' }) => {
  const map = {
    'Low': { label: 'Low', color: 'green' },
    'Medium': { label: 'Medium', color: 'blue' },
    'High': { label: 'High', color: 'orange' },
    'Critical': { label: 'Critical', color: 'red' }
  };

  const item = map[priority] || { label: priority, color: 'slate' };

  return (
    <Badge color={item.color} className={className}>
      {item.label}
    </Badge>
  );
};
export default PriorityBadge;
