// components/NotificationFilters.tsx
import React from 'react';
import { Filter, Search } from 'lucide-react';
import { FilterType } from '@/lib/types/notifications';

interface NotificationFiltersProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const filterOptions: FilterType[] = [
  'all', 'unread', 'read', 'client', 'payment', 'appointment', 'alert', 'system'
];

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filter,
  setFilter,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-8 w-8 text-gray-600" />
        {filterOptions.map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-6 py-2 rounded-sm text-xs font-medium transition-colors border ${
              filter === filterType
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-700 border-gray-300 hover:border-black hover:text-black'
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 bg-white border border-gray-300 text-black placeholder-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black w-full sm:w-64"
        />
      </div>
    </div>
  );
};