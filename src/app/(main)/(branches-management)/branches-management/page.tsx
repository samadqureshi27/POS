"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, AlertCircle, CheckCircle, X, Info, Edit } from 'lucide-react';

interface MenuItem {
  'Branch-ID': number;
  Branch_Name: string;
  Status: 'Active' | 'Inactive';
  'Contact-Info': string;
  Address: string;
   email: string;
  postalCode: string;
}

// Toast Notification
const Toast = ({
  message,
  type,
  onClose
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) => (
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

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    Branch_Name: '',
    Status: 'Active' as 'Active' | 'Inactive',
    'Contact-Info': '',
    Address: '',
    email: '',
  postalCode: '',
  });

  // Load sample data
  useEffect(() => {
    setTimeout(() => {
      setMenuItems([
        {
          'Branch-ID': 1,
          Branch_Name: 'Main Branch',
          Status: 'Active',
          'Contact-Info': '03001234567',
          Address: '123 Main St.',
           email: 'abd@gmail.com',
          postalCode: '35346',
        },
        {
          'Branch-ID': 2,
          Branch_Name: 'North Branch',
          Status: 'Inactive',
          'Contact-Info': '03007654321',
          Address: '456 North Ave.',
            email: 'abd123@gmail.com',
          postalCode: '2335346',
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredItems = menuItems.filter(item =>
    item.Branch_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    setActionLoading(true);
    setTimeout(() => {
      const remaining = menuItems.filter(item => !selectedItems.includes(item['Branch-ID']));
      setMenuItems(remaining);
      setSelectedItems([]);
      setActionLoading(false);
      showToast('Selected branches deleted successfully.', 'success');
    }, 600);
  };

  const handleSelectItem = (branchId: number, checked: boolean) => {
    setSelectedItems(checked
      ? [...selectedItems, branchId]
      : selectedItems.filter(id => id !== branchId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredItems.map(item => item['Branch-ID']) : []);
  };

  const handleSaveBranch = () => {
    if (!formData.Branch_Name || !formData['Contact-Info'] || !formData.Address) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setActionLoading(true);
    setTimeout(() => {
      if (editItem) {
        setMenuItems(prev =>
          prev.map(item =>
            item['Branch-ID'] === editItem['Branch-ID']
              ? { ...editItem, ...formData }
              : item
          )
        );
        showToast('Branch updated successfully.', 'success');
      } else {
        const newItem: MenuItem = {
          'Branch-ID': Math.max(0, ...menuItems.map(i => i['Branch-ID'])) + 1,
          ...formData,
        };
        setMenuItems(prev => [...prev, newItem]);
        showToast('Branch added successfully.', 'success');
      }

      setModalOpen(false);
      setEditItem(null);
      setFormData({ Branch_Name: '', Status: 'Active', 'Contact-Info': '', Address: '',email: '',
  postalCode: '' });
      setActionLoading(false);
    }, 1000);
  };

  const isAllSelected = selectedItems.length === filteredItems.length && filteredItems.length > 0;
  const isSomeSelected = selectedItems.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-yellow-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading branches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-10 p-6 bg-gray-50 min-h-screen">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Branch Management</h1>

        <div className="flex relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search branches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditItem(null);
              setFormData({ Branch_Name: '', Status: 'Active', 'Contact-Info': '', Address: '',email: '',
  postalCode: '' });
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Plus size={16} />
            New Branch
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
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 accent-yellow-600 border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Info</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item['Branch-ID']} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item['Branch-ID'])}
                      onChange={(e) => handleSelectItem(item['Branch-ID'], e.target.checked)}
                      className="w-4 h-4 accent-yellow-600 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{item['Branch-ID'].toString().padStart(3, '0')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.Branch_Name}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.Status === 'Active'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {item.Status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item['Contact-Info']}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.Address}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => alert(`Branch Info: ${item.Branch_Name}`)}
                      className="text-black-600 hover:text-black-800 transition-colors"
                    >
                      <Info size={16} />
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setEditItem(item);
                        setFormData({
  Branch_Name: item.Branch_Name,
  Status: item.Status,
  'Contact-Info': item['Contact-Info'],
  Address: item.Address,
  email: item.email || '',
  postalCode: item.postalCode || '',
});

                        setModalOpen(true);
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[700px]">
            <h2 className="text-xl font-semibold mb-4">{editItem ? 'Edit Branch' : 'New Branch'}</h2>
            <div className="mb-4 space-y-2">
              <input
                type="text"
                value={formData.Branch_Name}
                onChange={(e) => setFormData({ ...formData, Branch_Name: e.target.value })}
                placeholder="Branch Name"
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <select
                value={formData.Status}
                onChange={(e) => setFormData({ ...formData, Status: e.target.value as 'Active' | 'Inactive' })}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <input
                type="text"
                value={formData['Contact-Info']}
                onChange={(e) => setFormData({ ...formData, 'Contact-Info': e.target.value })}
                placeholder="Contact Info"
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={formData.Address}
                onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                placeholder="Address"
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />

              {/* ✅ Email Field */}
<input
  type="email"
  value={formData.email}
  onChange={(e) =>
    setFormData({ ...formData, email: e.target.value })
  }
  placeholder="Email"
  className="w-full px-4 py-2 border border-gray-300 rounded"
/>

{/* ✅ Postal Code Field */}
<input
  type="text"
  value={formData.postalCode}
  onChange={(e) =>
    setFormData({ ...formData, postalCode: e.target.value })
  }
  placeholder="Postal Code"
  className="w-full px-4 py-2 border border-gray-300 rounded"
/>

            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleSaveBranch} className="px-4 py-2 bg-yellow-600 text-white rounded">
                {actionLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
