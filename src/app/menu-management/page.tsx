"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Filter, Search, AlertCircle, CheckCircle, X } from 'lucide-react';

// Types
interface MenuItem {
  id: number;
  name: string;
  price: string;
  category: string;
  stockQty: string;
  status: 'Active' | 'Inactive';
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Fake API Service - Replace with real API calls later
class MenuAPI {
  private static delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  private static mockData: MenuItem[] = [
    { id: 1, name: 'Margherita Pizza', price: '12.99', category: 'Pizza', stockQty: '25', status: 'Active' },
    { id: 2, name: 'Caesar Salad', price: '8.50', category: 'Salads', stockQty: '15', status: 'Active' },
    { id: 3, name: 'Beef Burger', price: '14.99', category: 'Burgers', stockQty: '30', status: 'Active' },
    { id: 4, name: 'Chicken Wings', price: '11.99', category: 'Appetizers', stockQty: '20', status: 'Inactive' },
    { id: 5, name: 'Chocolate Cake', price: '6.99', category: 'Desserts', stockQty: '12', status: 'Active' },
    { id: 6, name: 'Grilled Salmon', price: '18.99', category: 'Main Course', stockQty: '18', status: 'Active' },
    { id: 7, name: 'Cappuccino', price: '4.50', category: 'Beverages', stockQty: '50', status: 'Active' },
    { id: 8, name: 'French Fries', price: '5.99', category: 'Sides', stockQty: '40', status: 'Active' },
  ];

  // GET /api/menu-items/
  static async getMenuItems(): Promise<ApiResponse<MenuItem[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: 'Menu items fetched successfully'
    };
  }

  // POST /api/menu-items/
  static async createMenuItem(item: Omit<MenuItem, 'id'>): Promise<ApiResponse<MenuItem>> {
    await this.delay(1000);
    const newItem = { ...item, id: Math.max(...this.mockData.map(i => i.id)) + 1 };
    this.mockData.push(newItem);
    return {
      success: true,
      data: newItem,
      message: 'Menu item created successfully'
    };
  }

  // PUT /api/menu-items/{id}/
  static async updateMenuItem(id: number, item: Partial<MenuItem>): Promise<ApiResponse<MenuItem>> {
    await this.delay(800);
    const index = this.mockData.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item not found');
    
    this.mockData[index] = { ...this.mockData[index], ...item };
    return {
      success: true,
      data: this.mockData[index],
      message: 'Menu item updated successfully'
    };
  }

  // DELETE /api/menu-items/{id}/
  static async deleteMenuItem(id: number): Promise<ApiResponse<null>> {
    await this.delay(600);
    const index = this.mockData.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item not found');
    
    this.mockData.splice(index, 1);
    return {
      success: true,
      data: null,
      message: 'Menu item deleted successfully'
    };
  }

  // DELETE /api/menu-items/bulk-delete/
  static async bulkDeleteMenuItems(ids: number[]): Promise<ApiResponse<null>> {
    await this.delay(1000);
    this.mockData = this.mockData.filter(item => !ids.includes(item.id));
    return {
      success: true,
      data: null,
      message: `${ids.length} menu items deleted successfully`
    };
  }
}

// notificsation component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`}>
    {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2">
      <X size={16} />
    </button>
  </div>
);

// Add/Edit Modal Component
const MenuItemModal = ({ 
  item, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  item: MenuItem | null; 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (item: Omit<MenuItem, 'id'>) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stockQty: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        price: item.price,
        category: item.category,
        stockQty: item.stockQty,
        status: item.status
      });
    } else {
      setFormData({
        name: '',
        price: '',
        category: '',
        stockQty: '',
        status: 'Active'
      });
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.category || !formData.stockQty) {
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {item ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
            <input
              type="number"
              value={formData.stockQty}
              onChange={(e) => setFormData({...formData, stockQty: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              {item ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load menu items on component mount
  useEffect(() => {
    loadMenuItems();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const response = await MenuAPI.getMenuItems();
      if (response.success) {
        setMenuItems(response.data);
      }
    } catch (error) {
      showToast('Failed to load menu items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (itemData: Omit<MenuItem, 'id'>) => {
    try {
      setActionLoading(true);
      const response = await MenuAPI.createMenuItem(itemData);
      if (response.success) {
        setMenuItems([...menuItems, response.data]);
        setIsModalOpen(false);
        showToast(response.message || 'Item created successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to create menu item', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (itemData: Omit<MenuItem, 'id'>) => {
    if (!editingItem) return;
    
    try {
      setActionLoading(true);
      const response = await MenuAPI.updateMenuItem(editingItem.id, itemData);
      if (response.success) {
        setMenuItems(menuItems.map(item => 
          item.id === editingItem.id ? response.data : item
        ));
        setIsModalOpen(false);
        setEditingItem(null);
        showToast(response.message || 'Item updated successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to update menu item', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      setActionLoading(true);
      const response = await MenuAPI.bulkDeleteMenuItems(selectedItems);
      if (response.success) {
        setMenuItems(menuItems.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
        showToast(response.message || 'Items deleted successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to delete menu items', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredItems.map(item => item.id) : []);
  };

  const handleSelectItem = (itemId: number, checked: boolean) => {
    setSelectedItems(checked 
      ? [...selectedItems, itemId]
      : selectedItems.filter(id => id !== itemId)
    );
  };

  // Filter and search logic
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(menuItems.map(item => item.category))];
  const isAllSelected = selectedItems.length === filteredItems.length && filteredItems.length > 0;
  const isSomeSelected = selectedItems.length > 0;

  if (loading) {
    return (
      <div className="mx-10 p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-10 p-6 bg-gray-50 min-h-screen">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Menu Management</h1>
        
        {/* Search and Filter Bar */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Plus size={16} />
              New Item
            </button>
            <button 
              onClick={handleDeleteSelected}
              disabled={!isSomeSelected || actionLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isSomeSelected && !actionLoading
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Trash2 size={16} />
              {actionLoading ? 'Deleting...' : 'Delete Selected'}
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredItems.length} of {menuItems.length} items
          </div>
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
                    className="w-4 h-4 accent-yellow-600 border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Qty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                      className="w-4 h-4 accent-yellow-600 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${item.price}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.stockQty}</td>
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
                    <button 
                      onClick={() => {
                        setEditingItem(item);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
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

      {/* Add/Edit Modal */}
      <MenuItemModal
        item={editingItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={editingItem ? handleUpdateItem : handleCreateItem}
      />
    </div>
  );
};

export default MenuManagement;