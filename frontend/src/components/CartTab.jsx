import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CartItem from './CartItem';
import { toggleStatusTab } from '../stores/Cart';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const CartTab = () => {
    const carts = useSelector(store => store.cart.items);
    const statusTab = useSelector(store => store.cart.statusTab);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const calculateTotal = async () => {
            try {
                setLoading(true);
                let total = 0;
                for (const item of carts) {
                    try {
                        let response;
                        if (item.source === 'products') {
                            response = await apiService.getProduct(item.productId);
                        } else if (item.source === 'electronics') {
                            response = await apiService.getElectronicsItem(item.productId);
                        }

                        if (response && response.data) {
                            total += response.data.price * item.quantity;
                        }
                    } catch (error) {
                        console.error('Error fetching product price:', error);
                    }
                }
                setTotalPrice(total);
                setError(null);
            } catch (err) {
                setError('Failed to calculate total');
                console.error('Error calculating total:', err);
            } finally {
                setLoading(false);
            }
        };

        calculateTotal();
    }, [carts]);

    const handleCloseTabCart = () => {
        dispatch(toggleStatusTab());
    }

    if (!statusTab) return null;

    return (
        <>
            {/* Backdrop with smooth fade */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 ease-out" 
                onClick={handleCloseTabCart}
            ></div>
            
            {/* Main cart panel */}
            <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out">
                <div className="h-full flex flex-col">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
                                <p className="text-sm text-gray-500">{carts.length} {carts.length === 1 ? 'item' : 'items'}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCloseTabCart}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                        >
                            <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Cart content */}
                    <div className="flex-1 overflow-y-auto bg-gray-50/50">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                <div className="relative">
                                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                </div>
                                <p className="text-gray-600 font-medium">Loading your cart...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <p className="text-red-600 font-medium">{error}</p>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                                >
                                    Try again
                                </button>
                            </div>
                        ) : carts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 space-y-6 px-6">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Your cart is empty</h3>
                                    <p className="text-gray-500 mb-6">Add some items to get started</p>
                                    <button
                                        onClick={handleCloseTabCart}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 space-y-4">
                                {carts.map((item, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                                        <CartItem data={item} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer with total and actions */}
                    {carts.length > 0 && (
                        <div className="border-t border-gray-200 bg-white p-6 space-y-4">
                            {/* Subtotal breakdown */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal ({carts.length} {carts.length === 1 ? 'item' : 'items'})</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Estimated Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                            </div>
                            
                            {/* Total */}
                            <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100">
                                <span className="text-lg font-semibold text-gray-800">Total</span>
                                <span className="text-2xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
                            </div>
                            
                            {/* Action buttons */}
                            <div className="flex space-x-3 pt-2">
                                <button
                                    onClick={handleCloseTabCart}
                                    className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                >
                                    Continue Shopping
                                </button>
                                <button
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:from-blue-600 disabled:hover:to-indigo-600"
                                    onClick={() => navigate('/cart')}
                                    disabled={carts.length === 0 || loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Loading...</span>
                                        </div>
                                    ) : (
                                        'Proceed to Checkout'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default CartTab;