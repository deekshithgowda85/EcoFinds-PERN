import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import axios from 'axios';
import Footer from '../../components/Footer';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        completedOrdersCount: 0,
        productsSoldCount: 0,
        electronicsSoldCount: 0,
        totalProducts: 0,
        totalElectronics: 0,
        totalUsers: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/orders/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setDashboardData(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, 
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            // Refresh dashboard data
            fetchDashboardData();
            alert(`Order status updated to ${newStatus} successfully!`);
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status');
        }
    };

    const handleCompleteOrder = async (orderId) => {
        await handleStatusChange(orderId, 'delivered');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 text-gray-900">
                <AdminNavbar />
                <div className="container mx-auto p-8">
                    <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 text-gray-900">
                <AdminNavbar />
                <div className="container mx-auto p-8">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <AdminNavbar />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">EcoFinds Admin Dashboard</h1>

                {/* Stats Overview */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-6">Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Revenue Card */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">💰</span>
                                </div>
                                <div className="text-green-600 text-sm font-medium">Revenue</div>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">Confirmed Revenue</h3>
                            <p className="text-2xl font-bold text-green-600">
                                ${dashboardData.totalRevenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">From delivered orders</p>
                        </div>

                        {/* Total Orders Card */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">📋</span>
                                </div>
                                <div className="text-blue-600 text-sm font-medium">Orders</div>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Orders</h3>
                            <p className="text-2xl font-bold text-blue-600">{dashboardData.totalOrders}</p>
                        </div>

                        {/* Completed Orders Card */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">✅</span>
                                </div>
                                <div className="text-green-600 text-sm font-medium">Delivered</div>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">Orders Delivered</h3>
                            <p className="text-2xl font-bold text-green-600">{dashboardData.completedOrdersCount}</p>
                        </div>

                        {/* Total Products Card */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">📦</span>
                                </div>
                                <div className="text-purple-600 text-sm font-medium">Items</div>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Products</h3>
                            <p className="text-2xl font-bold text-purple-600">
                                {dashboardData.totalProducts + dashboardData.totalElectronics}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Additional Stats */}
                <section className="mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                    <span className="text-lg">🌱</span>
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-gray-600 mb-1">Eco Products</h3>
                            <p className="text-xl font-bold text-green-600">{dashboardData.totalProducts}</p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-lg">⚡</span>
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-gray-600 mb-1">Smart Electronics</h3>
                            <p className="text-xl font-bold text-blue-600">{dashboardData.totalElectronics}</p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <span className="text-lg">📊</span>
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-gray-600 mb-1">Items Sold</h3>
                            <p className="text-xl font-bold text-indigo-600">
                                {dashboardData.productsSoldCount + dashboardData.electronicsSoldCount}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Delivered items</p>
                        </div>
                    </div>
                </section>

                {/* Recent Orders Section */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-6">Recent Orders</h2>
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        {dashboardData.recentOrders.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">📋</div>
                                <p className="text-gray-600 text-lg">No recent orders found</p>
                                <p className="text-gray-500 text-sm">Orders will appear here once customers start purchasing</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {dashboardData.recentOrders.map((order, index) => (
                                            <tr key={order.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                <td className="px-6 py-4 whitespace-nowrap font-mono text-blue-600">#{order.id}</td>
                                                <td className="px-6 py-4">
                                                    {order.items?.map((item, itemIndex) => (
                                                        <div key={itemIndex} className="text-sm mb-1">
                                                            <span className="text-gray-900">{item.productName || 'Unknown Product'}</span>
                                                            <span className="text-gray-500 ml-2">x {item.quantity || 0}</span>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-lg font-semibold text-green-600">
                                                        ${parseFloat(order.totalAmount || 0).toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        order.status === 'delivered' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : order.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : order.status === 'processing'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : order.status === 'shipped'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : order.status === 'cancelled'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {order.status || 'pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                                        <div className="flex space-x-2">
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="processing">Processing</option>
                                                                <option value="shipped">Shipped</option>
                                                                <option value="delivered">Delivered</option>
                                                                <option value="cancelled">Cancelled</option>
                                                            </select>
                                                        </div>
                                                    )}
                                                    {(order.status === 'delivered' || order.status === 'cancelled') && (
                                                        <span className="text-sm text-gray-500">No actions available</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashboard;