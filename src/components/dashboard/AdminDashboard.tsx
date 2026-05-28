import React, { useState } from 'react';
import { Users, Building, ShieldCheck, Activity } from 'lucide-react';
import { useAdmin, useAdminAutoLoad } from '../../hooks/useAdmin';
import { DashboardSearch } from './search/DashboardSearch';
import { DashboardTable } from './tables/DashboardTable';
import { EditUserModal } from '../admin/EditUserModal';
import { DeleteConfirmationModal } from '../admin/DeleteConfirmationModal';
import { User } from '../../types';
import { useDashboardSearch } from '../../hooks/useDashboardSearch';

export const AdminDashboard = () => {
  useAdminAutoLoad();
  const {
    users,
    agents,
    properties,
    deleteUser,
    deleteAgent,
    deleteProperty,
    updateUser,
  } = useAdmin();

  const { selectedTab, setSelectedTab } = useDashboardSearch();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ type: string; id: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const stats = {
    totalUsers: users.length,
    totalProperties: properties.length,
    totalAgents: agents.length,
    activeListings: properties.filter(p => p.status === 'available').length,
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;

    setIsDeleting(true);
    try {
      switch (deletingItem.type) {
        case 'user':
          await deleteUser(deletingItem.id);
          break;
        case 'agent':
          await deleteAgent(deletingItem.id);
          break;
        case 'property':
          await deleteProperty(deletingItem.id);
          break;
      }
    } finally {
      setIsDeleting(false);
      setDeletingItem(null);
    }
  };

  const handleUserUpdate = async (data: Partial<User>) => {
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, data);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <div>
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Users className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Building className="w-8 h-8 text-green-600 mb-2" />
          <h3 className="text-lg font-semibold">Properties</h3>
          <p className="text-3xl font-bold">{stats.totalProperties}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ShieldCheck className="w-8 h-8 text-purple-600 mb-2" />
          <h3 className="text-lg font-semibold">Agents</h3>
          <p className="text-3xl font-bold">{stats.totalAgents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Activity className="w-8 h-8 text-yellow-600 mb-2" />
          <h3 className="text-lg font-semibold">Active Listings</h3>
          <p className="text-3xl font-bold">{stats.activeListings}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-md ${
                selectedTab === 'properties'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setSelectedTab('properties')}
            >
              Properties
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                selectedTab === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setSelectedTab('users')}
            >
              Users
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                selectedTab === 'agents'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setSelectedTab('agents')}
            >
              Agents
            </button>
          </div>
        </div>

        <DashboardSearch type={selectedTab} />

        <DashboardTable
          type={selectedTab}
          data={
            selectedTab === 'properties'
              ? properties
              : selectedTab === 'users'
              ? users
              : agents
          }
          onEdit={selectedTab === 'users' ? setEditingUser : undefined}
          onDelete={(id) =>
            setDeletingItem({ type: selectedTab.slice(0, -1), id })
          }
        />
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={handleUserUpdate}
        />
      )}

      {deletingItem && (
        <DeleteConfirmationModal
          title={`Delete ${deletingItem.type}`}
          message={`Are you sure you want to delete this ${deletingItem.type}? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingItem(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};