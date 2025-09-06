import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONS ---
import {
    FaChevronDown,
    FaChevronUp,
    FaUserCircle,
    FaShoppingCart,
    FaBoxOpen,
    FaEdit,
    FaTimes,
    FaUser,
    FaEnvelope,
    FaCalendarAlt,
    FaCreditCard,
    FaMapMarkerAlt,
    FaPhone,
    FaCamera,
    FaCheck,
    FaTruck,
    FaClock,
    FaHeart,
    FaStar,
    FaDownload,
    FaEye
} from 'react-icons/fa';

// --- PROJECT IMPORTS (ASSUMED TO BE CORRECT) ---
import { useAppContext } from '../context/Appcontext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import CartItem from '../components/CartItem';
import { apiService } from '../services/api';

// =================================================================================
// --- ENHANCED EDIT PROFILE MODAL COMPONENT ---
// =================================================================================
const EditProfileModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: user?.name || user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        bio: user?.bio || ''
    });
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        return newErrors;
    };

    const handleSave = () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        console.log("Saving user data:", formData);
        onSave({ ...user, ...formData });
        onClose();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            // Simulate upload
            setTimeout(() => {
                setIsUploading(false);
                // In real app, handle image upload
            }, 1500);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: -50, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -50, opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-800">Edit Profile</h2>
                        <button 
                            onClick={onClose} 
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <FaTimes size={18} className="text-slate-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Profile Picture Section */}
                    <div className="text-center">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                {isUploading ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                ) : (
                                    <FaUserCircle size={60} className="text-white" />
                                )}
                            </div>
                            <label className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                <FaCamera size={14} className="text-slate-600" />
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>
                        <p className="text-sm text-slate-500 mt-2">Click camera to upload photo</p>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                <FaUser className="inline mr-2" />
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                                    errors.name ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'
                                }`}
                                placeholder="Enter your full name"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                <FaEnvelope className="inline mr-2" />
                                Email Address *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                                    errors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'
                                }`}
                                placeholder="Enter your email"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                <FaPhone className="inline mr-2" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                <FaMapMarkerAlt className="inline mr-2" />
                                Address
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                                placeholder="Enter your address"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Bio
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                            placeholder="Tell us about yourself..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 rounded-b-xl">
                    <div className="flex justify-end space-x-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="px-6 py-2.5 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 shadow-lg"
                        >
                            Save Changes
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// =================================================================================
// --- STATS CARD COMPONENT ---
// =================================================================================
const StatsCard = ({ icon, label, value, color = "emerald" }) => {
    const colorClasses = {
        emerald: "from-emerald-500 to-emerald-600",
        blue: "from-blue-500 to-blue-600",
        orange: "from-orange-500 to-orange-600",
        purple: "from-purple-500 to-purple-600"
    };

    return (
        <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
        >
            <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white`}>
                    {icon}
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-800">{value}</p>
                    <p className="text-sm text-slate-500">{label}</p>
                </div>
            </div>
        </motion.div>
    );
};

// =================================================================================
// --- MAIN PROFILE PAGE COMPONENT ---
// =================================================================================
function ProfilePage() {
    // --- STATE MANAGEMENT ---
    const { user, setUser } = useAppContext();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const carts = useSelector(store => store.cart.items);
    
    const [activeTab, setActiveTab] = useState('profile');
    const [isModalOpen, setModalOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState(null);
    const [expandedOrders, setExpandedOrders] = useState([]);

    // --- BUSINESS LOGIC (NO CHANGES) ---
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
                const ordersWithStatus = (response || []).map((order, index) => ({
                    ...order,
                    status: ['Delivered', 'Shipped', 'Pending', 'Processing'][index % 4],
                    trackingNumber: `TN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                    estimatedDelivery: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
                }));
                setOrders(ordersWithStatus);
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
        setExpandedOrders(prev => prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]);
    };
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    const handleSaveProfile = (updatedUser) => {
        if (setUser) {
            setUser(updatedUser);
        }
    };

    // --- STATS CALCULATION ---
    const stats = {
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum, order) => sum + (order.total || 0), 0),
        cartItems: carts.length,
        memberSince: user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()
    };
    
    // --- TABS DATA ---
    const tabs = [
        { id: 'profile', label: 'Profile', icon: <FaUserCircle /> },
        { id: 'orders', label: 'Orders', icon: <FaBoxOpen />, badge: orders.length > 0 ? orders.length : null },
        { id: 'cart', label: 'Cart', icon: <FaShoppingCart />, badge: carts.length > 0 ? carts.length : null },
    ];

    // --- RENDER FUNCTIONS ---
    
    const renderProfileDetails = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-8 rounded-2xl">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                    <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                            <FaUserCircle size={80} className="text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-full">
                            <FaCheck size={16} className="text-white" />
                        </div>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">
                            {user?.name || user?.username || 'Welcome!'}
                        </h2>
                        <p className="text-slate-600 mb-4">{user?.email || 'Add your email'}</p>
                        <p className="text-slate-500 text-sm mb-4">
                            {user?.bio || "Tell us about yourself and your sustainable shopping journey..."}
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setModalOpen(true)}
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 shadow-lg"
                        >
                            <FaEdit />
                            <span>Edit Profile</span>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard icon={<FaBoxOpen />} label="Total Orders" value={stats.totalOrders} color="emerald" />
                <StatsCard icon={<FaCreditCard />} label="Total Spent" value={`$${stats.totalSpent.toFixed(2)}`} color="blue" />
                <StatsCard icon={<FaShoppingCart />} label="Cart Items" value={stats.cartItems} color="orange" />
                <StatsCard icon={<FaCalendarAlt />} label="Member Since" value={stats.memberSince} color="purple" />
            </div>

            {/* Account Information */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Account Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <FaUser className="text-emerald-600" />
                            <div>
                                <p className="text-sm text-slate-500">Full Name</p>
                                <p className="font-semibold text-slate-800">{user?.name || user?.username || 'Not provided'}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <FaEnvelope className="text-emerald-600" />
                            <div>
                                <p className="text-sm text-slate-500">Email Address</p>
                                <p className="font-semibold text-slate-800">{user?.email || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <FaPhone className="text-emerald-600" />
                            <div>
                                <p className="text-sm text-slate-500">Phone Number</p>
                                <p className="font-semibold text-slate-800">{user?.phone || 'Not provided'}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <FaMapMarkerAlt className="text-emerald-600" />
                            <div>
                                <p className="text-sm text-slate-500">Address</p>
                                <p className="font-semibold text-slate-800">{user?.address || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderCart = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Shopping Cart</h3>
                    <span className="bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {carts.length} items
                    </span>
                </div>
                {carts.length > 0 ? (
                    <div className="space-y-4">
                        {carts.map((item, key) => (
                            <div key={key} className="p-4 border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors">
                                <CartItem data={item} />
                            </div>
                        ))}
                        <div className="mt-8 pt-6 border-t border-slate-200">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg"
                                    onClick={() => navigate('/cart')}
                                >
                                    Proceed to Checkout
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                                    onClick={() => navigate('/products')}
                                >
                                    Continue Shopping
                                </motion.button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <FaShoppingCart size={48} className="text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">Your cart is empty</h3>
                        <p className="text-slate-500 mb-6">Discover amazing sustainable products!</p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-emerald-700 hover:to-emerald-800 shadow-lg"
                            onClick={() => navigate('/products')}
                        >
                            Start Shopping
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.div>
    );

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <FaCheck className="text-green-600" />;
            case 'Shipped': return <FaTruck className="text-blue-600" />;
            case 'Processing': return <FaClock className="text-yellow-600" />;
            default: return <FaClock className="text-gray-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const renderOrders = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Order History</h3>
                    {orders.length > 0 && (
                        <span className="bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full">
                            {orders.length} orders
                        </span>
                    )}
                </div>

                {loadingOrders ? (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                        <p className="text-slate-500">Loading your orders...</p>
                    </div>
                ) : ordersError ? (
                    <div className="text-center py-16">
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                            {ordersError}
                        </div>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="text-emerald-600 font-semibold hover:text-emerald-700"
                        >
                            Try Again
                        </button>
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <motion.div 
                                key={order.id} 
                                className="border border-slate-200 rounded-xl overflow-hidden hover:border-emerald-300 transition-colors"
                                whileHover={{ scale: 1.01 }}
                            >
                                <div 
                                    className="flex justify-between items-center p-6 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors" 
                                    onClick={() => toggleOrderExpansion(order.id)}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            {getStatusIcon(order.status)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">Order #{order.id}</h4>
                                            <p className="text-sm text-slate-500">
                                                {new Date(order.orderDate).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </p>
                                            {order.trackingNumber && (
                                                <p className="text-xs text-slate-400">Tracking: {order.trackingNumber}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="font-bold text-slate-800">${(order.total || 0).toFixed(2)}</p>
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <motion.div animate={{ rotate: expandedOrders.includes(order.id) ? 180 : 0 }}>
                                            <FaChevronDown className="text-slate-400" />
                                        </motion.div>
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {expandedOrders.includes(order.id) && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 border-t border-slate-200 bg-white">
                                                {/* Order Items */}
                                                <div className="space-y-4 mb-6">
                                                    {order.items?.map((item, index) => (
                                                        <div key={index} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                                                            <div className="w-16 h-16 bg-slate-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                                                                <FaBoxOpen className="text-slate-400" />
                                                            </div>
                                                            <div className="flex-grow">
                                                                <p className="font-semibold text-slate-800">{item.productName}</p>
                                                                <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-bold text-slate-800">${item.price.toFixed(2)}</p>
                                                                <p className="text-xs text-slate-500">each</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Order Actions */}
                                                <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-200 transition-colors"
                                                    >
                                                        <FaEye />
                                                        <span>View Details</span>
                                                    </motion.button>
                                                    {order.status === 'Delivered' && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                                                        >
                                                            <FaStar />
                                                            <span>Rate & Review</span>
                                                        </motion.button>
                                                    )}
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                                                    >
                                                        <FaDownload />
                                                        <span>Download Invoice</span>
                                                    </motion.button>
                                                    {(order.status === 'Shipped' || order.status === 'Processing') && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-700 font-semibold rounded-lg hover:bg-orange-200 transition-colors"
                                                        >
                                                            <FaTruck />
                                                            <span>Track Package</span>
                                                        </motion.button>
                                                    )}
                                                </div>

                                                {/* Delivery Information */}
                                                {order.estimatedDelivery && order.status !== 'Delivered' && (
                                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                                        <p className="text-sm text-blue-700">
                                                            <FaTruck className="inline mr-2" />
                                                            Estimated delivery: <strong>{order.estimatedDelivery}</strong>
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <FaBoxOpen size={48} className="text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No orders yet</h3>
                        <p className="text-slate-500 mb-6">Start your sustainable shopping journey!</p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-emerald-700 hover:to-emerald-800 shadow-lg"
                            onClick={() => navigate('/products')}
                        >
                            Browse Products
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.div>
    );

    // --- MAIN RENDER ---
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <Navbar />
                <AnimatePresence>
                    {isModalOpen && (
                        <EditProfileModal 
                            user={user} 
                            onClose={() => setModalOpen(false)} 
                            onSave={handleSaveProfile} 
                        />
                    )}
                </AnimatePresence>
                
                <main className="w-full max-w-6xl mx-auto px-4 py-8">
                    {/* Header Section */}
                    <motion.header 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
                                    My Account
                                </h1>
                                <p className="text-slate-600">
                                    Manage your profile, orders, and sustainable shopping preferences
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleLogout}
                                    className="px-6 py-3 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors border border-red-200"
                                >
                                    Sign Out
                                </motion.button>
                            </div>
                        </div>
                    </motion.header>
                    
                    {/* Tab Navigation */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                    >
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2">
                            <nav className="flex space-x-2">
                                {tabs.map(tab => (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`${
                                            activeTab === tab.id
                                                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg'
                                                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                                        } flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold transition-all relative`}
                                    >
                                        {tab.icon}
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        {tab.badge && (
                                            <span className={`${
                                                activeTab === tab.id ? 'bg-white text-emerald-700' : 'bg-emerald-100 text-emerald-700'
                                            } text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center`}>
                                                {tab.badge}
                                            </span>
                                        )}
                                    </motion.button>
                                ))}
                            </nav>
                        </div>
                    </motion.div>

                    {/* Tab Content */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && renderProfileDetails()}
                            {activeTab === 'cart' && renderCart()}
                            {activeTab === 'orders' && renderOrders()}
                        </AnimatePresence>
                    </motion.div>
                </main>

                {/* Footer Section */}
                <footer className="mt-16 bg-white border-t border-slate-200">
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <div className="text-center text-slate-500">
                            <p className="mb-4">
                                🌱 Thank you for choosing sustainable shopping with us!
                            </p>
                            <div className="flex justify-center space-x-6 text-sm">
                                <button className="hover:text-emerald-600 transition-colors">Help Center</button>
                                <button className="hover:text-emerald-600 transition-colors">Contact Support</button>
                                <button className="hover:text-emerald-600 transition-colors">Privacy Policy</button>
                                <button className="hover:text-emerald-600 transition-colors">Terms of Service</button>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default ProfilePage;