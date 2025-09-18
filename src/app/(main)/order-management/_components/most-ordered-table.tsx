// _components/OrderStats/MostOrderedTable.tsx
import React from 'react';

import { OrderItem } from '@/lib/types';

interface MostOrderedTableProps {
  data: OrderItem[];
  loading: boolean;
}

const MostOrderedTable: React.FC<MostOrderedTableProps> = ({ data, loading }) => {
  return (
    <div className="bg-muted rounded-sm overflow-x-auto">
      <div className="max-h-[300px] overflow-y-auto">
        <div className="flex items-center justify-center flex-1 gap-2 max-h-[50px] border border-border rounded-sm mb-2 p-4 bg-card shadow-sm">
          <div>
            <p className="text-2xl mb-1">Most Ordered</p>
          </div>
        </div>

        <table className="min-w-full divide-y divide-border border border-border rounded-sm table-fixed text-sm">
          <thead className="bg-card border-b rounded-sm border-border sticky top-0">
            <tr>
              <th className="px-2 py-2 text-left">Rank</th>
              <th className="px-2 py-2 text-left">Name</th>
              <th className="px-2 py-2 text-left">Total Number</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-2 py-4 text-center text-muted-foreground">
                  Loading statistics...
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.Order} className="bg-card hover:bg-accent">
                  <td className="px-2 py-2">#{index + 1}</td>
                  <td className="px-2 py-2">{item.Name}</td>
                  <td className="px-2 py-2">{item.number_item}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MostOrderedTable;