'use client';

import { useState, useEffect } from 'react';
import { User, CreateStaffData, UserRole } from '@/types/auth';
import authService from '@/lib/authService';
import { useAuth } from '@/lib/hooks/useAuth';

interface StaffManagementProps {
  className?: string;
}

export default function StaffManagement({ className = '' }: StaffManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await authService.getUsers();
      if (response.success && response.data) {
        // Admin can only see users they created
        setUsers(response.data);
      }
    } catch (error) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message: string, isError: boolean = false) => {
    if (isError) {
      setError(message);
      setTimeout(() => setError(''), 3000);
    } else {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  // Create Staff Modal Component
  const CreateStaffModal = () => {
    const [formData, setFormData] = useState<CreateStaffData>({
      username: '',
      role: 'cashier',
      pin: ''
    });
    const [createLoading, setCreateLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!formData.username || !formData.pin) {
        showMessage('Please fill in all required fields', true);
        return;
      }

      if (formData.pin.length < 4) {
        showMessage('PIN must be at least 4 digits', true);
        return;
      }

      setCreateLoading(true);
      try {
        const response = await authService.createStaff(formData);
        if (response.success && response.data) {
  showMessage(`${formData.role} created successfully`);
  setUsers(prev => [...prev, response.data!]);
          setShowCreateModal(false);
          setFormData({ username: '', role: 'cashier', pin: '' });
        } else {
          showMessage(response.error || 'Failed to create staff', true);
        }
      } catch (error) {
        showMessage('Failed to create staff', true);
      } finally {
        setCreateLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Create Staff Member</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'manager' | 'cashier' | 'waiter' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="cashier">Cashier</option>
                <option value="waiter">Waiter</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PIN (4-6 digits) *
              </label>
              <input
                type="text"
                value={formData.pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setFormData(prev => ({ ...prev, pin: value }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter 4-6 digit PIN"
                maxLength={6}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Staff will use this PIN to login to the POS system
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={createLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={createLoading}
              >
                {createLoading ? 'Creating...' : 'Create Staff'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Reset Password Modal (for users with email/password, not PIN users)
  const ResetPasswordModal = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    const handleResetPassword = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!newPassword || newPassword !== confirmPassword) {
        showMessage('Passwords do not match', true);
        return;
      }

      if (newPassword.length < 8) {
        showMessage('Password must be at least 8 characters', true);
        return;
      }

      if (!selectedUser) return;

      setResetLoading(true);
      try {
        const response = await authService.resetUserPassword(selectedUser.id, newPassword);
        if (response.success) {
          showMessage('Password reset successfully');
          setShowResetPasswordModal(false);
          setSelectedUser(null);
          setNewPassword('');
          setConfirmPassword('');
        } else {
          showMessage(response.error || 'Failed to reset password', true);
        }
      } catch (error) {
        showMessage('Failed to reset password', true);
      } finally {
        setResetLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">
            Reset Password for {selectedUser?.username}
          </h3>
          
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowResetPasswordModal(false);
                  setSelectedUser(null);
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={resetLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={resetLoading}
              >
                {resetLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleUpdatePin = async (userId: string, newPin: string) => {
    try {
      const response = await authService.updateUserPin(userId, newPin);
      if (response.success) {
        showMessage('PIN updated successfully');
        loadUsers();
      } else {
        showMessage(response.error || 'Failed to update PIN', true);
      }
    } catch (error) {
      showMessage('Failed to update PIN', true);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      const response = await authService.toggleUserStatus(userId);
      if (response.success) {
        showMessage('User status updated successfully');
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, is_active: !user.is_active }
            : user
        ));
      } else {
        showMessage(response.error || 'Failed to update user status', true);
      }
    } catch (error) {
      showMessage('Failed to update user status', true);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Staff Management</h2>
            <p className="text-sm text-gray-600">
              Manage your staff members (PIN-based authentication only)
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Staff Member
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mx-6 mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Staff Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Staff Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PIN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    {user.email && (
                      <div className="text-sm text-gray-500">{user.email}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'manager' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'cashier' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.pin ? '****' : 'No PIN'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      const newPin = prompt('Enter new PIN (4-6 digits):');
                      if (newPin && newPin.length >= 4 && newPin.length <= 6) {
                        handleUpdatePin(user.id, newPin);
                      }
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Update PIN
                  </button>
                  
                  {user.email && (
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowResetPasswordModal(true);
                      }}
                      className="text-orange-600 hover:text-orange-900"
                    >
                      Reset Password
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    className={user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                  >
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No staff members found. Create your first staff member to get started.
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && <CreateStaffModal />}
      {showResetPasswordModal && <ResetPasswordModal />}
    </div>
  );
}