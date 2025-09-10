// _components/OrderStats/LeastOrderedTable.tsx
import React from 'react';

import { OrderItem } from '@/lib/types';


interface LeastOrderedTableProps {
  data: OrderItem[];
  loading: boolean;
}

const LeastOrderedTable: React.FC<LeastOrderedTableProps> = ({ data, loading }) => {
  return (
    <div className="bg-gray-50 rounded-sm overflow-x-auto">
      <div className="max-h-[300px] overflow-y-auto">
        <div className="flex items-center justify-center flex-1 gap-2 max-h-[50px] border border-gray-300 rounded-sm mb-2 p-4 bg-white shadow-sm">
          <div>
            <p className="text-2xl mb-1">Least Ordered</p>
          </div>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200 table-fixed border rounded-sm border-gray-300 text-sm">
          <thead className="bg-white border-b border-gray-300 sticky top-0">
            <tr>
              <th className="px-2 py-2 text-left">Rank</th>
              <th className="px-2 py-2 text-left">Name</th>
              <th className="px-2 py-2 text-left">Total Number</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-2 py-4 text-center text-gray-500">
                  Loading statistics...
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.Order} className="bg-white hover:bg-gray-50">
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

export default LeastOrderedTable;