import React from 'react';
import { Badge } from './Badge';

export const StatusBadge = ({ status, className = '' }) => {
  const map = {
    'Created': { label: 'Created', color: 'slate' },
    'Verification': { label: 'Verification', color: 'amber' },
    'Assigned': { label: 'Assigned', color: 'blue' },
    'Working': { label: 'In Progress', color: 'indigo' },
    'Completed': { label: 'Completed', color: 'emerald' },
    'Citizen Feedback': { label: 'Feedback Submitted', color: 'pink' }
  };

  const item = map[status] || { label: status, color: 'slate' };

  return (
    <Badge color={item.color} className={className}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1" />
      {item.label}
    </Badge>
  );
};
export default StatusBadge;
