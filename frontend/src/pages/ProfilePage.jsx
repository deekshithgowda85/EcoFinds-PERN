import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/Appcontext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import CartItem from '../components/CartItem';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

function ProfilePage() {
    const { user } = useAppContext();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const carts = useSelector(store => store.cart.items);

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState(null);
    const [expandedOrders, setExpandedOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setLoadingOrders(false);
                setOrders([]);
                return;
            }
            try {
                setLoadingOrders(true);
                const response = await apiService.getOrders();
                if (response && Array.isArray(response)) {
                    setOrders(response);
                } else {
                    setOrders([]);
                }
                setOrdersError(null);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setOrdersError('Failed to fetch orders. Please try again later.');
                setOrders([]);
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchOrders();
    }, [user]);

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrders(prevExpandedOrders => {
            if (prevExpandedOrders.includes(orderId)) {
                return prevExpandedOrders.filter(id => id !== orderId);
            } else {
                return [...prevExpandedOrders, orderId];
            }
        });
    };

    const renderProfileDetails = () => (
        <div className="bg-white p-6 rounded-xl shadow-xl h-full flex flex-col border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-4">Profile Details</h2>
            {user ? (
                <div className="text-gray-700 space-y-4 flex-grow">
                    <div className="flex justify-between items-start">
                        <span className="font-semibold pr-2 min-w-[100px]">Username:</span>
                        <span className="text-gray-900 font-medium text-right break-words flex-1">{user.name || user.username || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-start">
                        <span className="font-semibold pr-2 min-w-[100px]">Email:</span>
                        <span className="text-gray-900 font-medium text-right break-words flex-1">{user.email || 'N/A'}</span>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 text-center flex-grow flex items-center justify-center">Please log in to see profile details.</p>
            )}
        </div>
    );

    const renderOrders = () => (
        <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-4">My Orders</h2>
            {loadingOrders ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            ) : ordersError ? (
                <div className="text-center py-8">
                    <p className="text-red-500">{ordersError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        Retry
                    </button>
                </div>
            ) : orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map(order => {
                        const isExpanded = expandedOrders.includes(order.id);

                        return (
                            <div key={order.id} className="bg-gray-50 p-4 rounded-lg shadow border border-gray-200">
                                <div className="flex justify-between items-center border-b border-gray-200 pb-3 cursor-pointer" onClick={() => toggleOrderExpansion(order.id)}>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">Order #{order.id}</h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.orderDate).toLocaleDateString()} - ${order.totalAmount}
                                        </p>
                                    </div>
                                    {isExpanded ? (
                                        <FaChevronDown className="text-gray-400" />
                                    ) : (
                                        <FaChevronRight className="text-gray-400" />
                                    )}
                                </div>
                                {isExpanded && (
                                    <div className="space-y-3 mt-3">
                                        {order.items && order.items.length > 0 ? (
                                            order.items.map((item, itemIndex) => (
                                                <CartItem
                                                    key={itemIndex}
                                                    data={{
                                                        id: item.productId,
                                                        name: item.productName,
                                                        price: item.price,
                                                        quantity: item.quantity,
                                                        source: item.productSource,
                                                        productId: item.productId
                                                    }}
                                                    isReadOnly={true}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-center">No items in this order.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">You have no previous orders.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        Start Shopping
                    </button>
                </div>
            )}
        </div>
    );

    const renderCart = () => (
        <div className="bg-white p-6 rounded-xl shadow-xl h-full flex flex-col border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-4">My Cart</h2>
            <div className="space-y-4 flex-grow">
                {carts.length > 0 ? (
                    carts.map((item, key) => (
                        <CartItem key={key} data={item} />
                    ))
                ) : (
                    <p className="text-gray-500 text-center flex-grow flex items-center justify-center">Your cart is empty.</p>
                )}
            </div>
            {carts.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        onClick={() => navigate('/cart')}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">User Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 flex flex-col">
                        {renderProfileDetails()}
                    </div>
                    <div className="md:col-span-2 flex flex-col">
                        {renderCart()}
                    </div>
                </div>

                <div className="mt-8">
                    {renderOrders()}
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage; 