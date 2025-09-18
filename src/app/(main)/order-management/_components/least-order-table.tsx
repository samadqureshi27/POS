// _components/OrderStats/LeastOrderedTable.tsx
import React from 'react';
import { DataTable, DataTableColumn } from "@/components/ui/data-table";
import { OrderItem } from '@/lib/types';

interface LeastOrderedTableProps {
  data: OrderItem[];
  loading: boolean;
}

const LeastOrderedTable: React.FC<LeastOrderedTableProps> = ({ data, loading }) => {
  const columns: DataTableColumn<OrderItem>[] = [
    {
      key: "rank",
      title: "Rank",
      render: (_, __, index) => `#${index + 1}`,
      width: "80px"
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "Name"
    },
    {
      key: "totalNumber",
      title: "Total Number",
      dataIndex: "number_item",
      mobileLabel: "Count"
    }
  ];

  return (
    <div className="bg-gray-50 rounded-sm overflow-x-auto">
      <div className="max-h-[300px] overflow-y-auto">
        <div className="flex items-center justify-center flex-1 gap-2 max-h-[50px] border border-gray-300 rounded-sm mb-2 p-4 bg-white shadow-sm">
          <div>
            <p className="text-2xl mb-1">Least Ordered</p>
          </div>
        </div>

        <DataTable
          data={data}
          columns={columns}
          selectable={false}
          getRowId={(item) => item.Order}
          maxHeight="250px"
          emptyMessage={loading ? "Loading statistics..." : "No data available"}
          loading={loading}
          mobileResponsive={true}
          nameColumn="name"
          className="border rounded-sm border-gray-300"
        />
      </div>
    </div>
  );
};

export default LeastOrderedTable;