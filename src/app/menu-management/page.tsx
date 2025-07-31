'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit, Filter, MenuSquare, Grid3X3, Settings } from 'lucide-react';

const MenuManagement = () => {

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Sample menu data
  const menuItems = [
    { id: 1, name: 'Margherita Pizza', price: '$12.99', category: 'Pizza', stockQty: '25', status: 'Active' },
    { id: 2, name: 'Caesar Salad', price: '$8.50', category: 'Salads', stockQty: '15', status: 'Active' },
    { id: 3, name: 'Beef Burger', price: '$14.99', category: 'Burgers', stockQty: '30', status: 'Active' },
    { id: 4, name: 'Chicken Wings', price: '$11.99', category: 'Appetizers', stockQty: '20', status: 'Inactive' },
    { id: 5, name: 'Chocolate Cake', price: '$6.99', category: 'Desserts', stockQty: '12', status: 'Active' },
    { id: 6, name: 'Grilled Salmon', price: '$18.99', category: 'Main Course', stockQty: '18', status: 'Active' },
    { id: 7, name: 'Cappuccino', price: '$4.50', category: 'Beverages', stockQty: '50', status: 'Active' },
    { id: 8, name: 'French Fries', price: '$5.99', category: 'Sides', stockQty: '40', status: 'Active' },
  ];


  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(menuItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const isAllSelected = selectedItems.length === menuItems.length;
  const isSomeSelected = selectedItems.length > 0;

  return (
    <div className="mx-10 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Menu</h1>
        
        {/* Tabs */}


        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#CCAB4D] text-white rounded-lg hover:bg-[#CCAB4D] transition-colors">
              <Plus size={16} />
              New
            </button>
            <button 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isSomeSelected 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!isSomeSelected}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            Filter Results
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 accent-black  border-gray-300 rounded focus:ring-black-500"
                  />
                </th>
                
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Qty
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menuItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                      className="w-4 h-4 accent-black border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.price}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.stockQty}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'Active' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{item.id.toString().padStart(3, '0')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button className="text-ligthblue-600 hover:text-blue-800 transition-colors">
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selection Info */}
      {isSomeSelected && (
        <div className="mt-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;