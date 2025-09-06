import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { apiService } from '../../services/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await apiService.getUsers();
            setUsers(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await apiService.updateUserRole(userId, { role: newRole });
            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ));
        } catch (err) {
            console.error('Error updating user role:', err);
            alert('Failed to update user role.');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await apiService.deleteUser(userId);
                setUsers(users.filter(user => user.id !== userId));
            } catch (err) {
                console.error('Error deleting user:', err);
                alert('Failed to delete user.');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
                <div className="text-lg font-medium">Loading users...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
                <div className="text-red-500 text-lg font-medium">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <AdminNavbar />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">User Management</h1>

                {/* Manage Users Section - Only listing existing users */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Existing Users</h2>
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        {/* Existing Users List */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {users.length > 0 ? (
                                            users.map(user => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username || user.name || 'N/A'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                            className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white"
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="text-red-600 hover:text-red-800 font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No users found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserManagement; 