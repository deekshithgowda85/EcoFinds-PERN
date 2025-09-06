import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [orderId, setOrderId] = useState(null);
    const [totalAmount, setTotalAmount] = useState(null);

    useEffect(() => {
        if (location.state && location.state.orderId) {
            setOrderId(location.state.orderId);
        } else {
            console.warn('No order ID found in navigation state.');
            // Optionally navigate away if no orderId is found
            // navigate('/home');
        }
    }, [location.state, navigate]);

    const handleBackToHome = () => {
        navigate('/home');
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Successful!</h1>
                        <p className="text-gray-600">Thank you for your purchase. Your order has been placed successfully.</p>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 mb-2">Order ID: #{orderId}</p>
                            <p className="text-gray-700">Total Amount: ${totalAmount}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/profile')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                            View Order Status
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage; 