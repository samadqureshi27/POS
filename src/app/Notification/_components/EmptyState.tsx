// components/EmptyState.tsx
import React from 'react';
import { Bell } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 text-lg">No notifications found</p>
      <p className="text-gray-500 text-sm">Try adjusting your filters or search query</p>
    </div>
  );
};