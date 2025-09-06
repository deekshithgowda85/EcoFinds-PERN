import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { apiService } from '../../services/api';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await apiService.getOrders();
                if (response && Array.isArray(response)) {
                    setOrders(response);
                } else {
                    setOrders([]);
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to fetch orders. Please try again later.');
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 text-gray-900">
                <AdminNavbar />
                <div className="container mx-auto p-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 text-gray-900">
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
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <AdminNavbar />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Orders</h1>

                <section className="mb-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        {orders.length === 0 ? (
                            <p className="text-gray-600">No orders found</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4">Order ID</th>
                                            <th className="text-left py-3 px-4">Items</th>
                                            <th className="text-left py-3 px-4">Total Amount</th>
                                            <th className="text-left py-3 px-4">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id} className="border-b border-gray-200">
                                                <td className="py-3 px-4">#{order.id}</td>
                                                <td className="py-3 px-4">
                                                    {order.items?.map((item, index) => (
                                                        <div key={index} className="text-sm">
                                                            {item.productName || 'Unknown Product'} x {item.quantity || 0}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="py-3 px-4">
                                                    ${parseFloat(order.totalAmount || 0).toFixed(2)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
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
        </div>
    );
};

export default AdminDashboard;