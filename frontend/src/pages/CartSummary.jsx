import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CartItem from '../components/CartItem';
import { apiService } from '../services/api';

const CartSummary = () => {
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart.items);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deliveryInfo, setDeliveryInfo] = useState({
        name: '',
        address: '',
        city: '',
        country: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let total = 0;

                for (const item of cartItems) {
                    let response;
                    if (item.source === 'products') {
                        response = await apiService.getProduct(item.productId);
                    } else if (item.source === 'groceries') {
                        response = await apiService.getGrocery(item.productId);
                    }

                    if (response && response.data) {
                        total += response.data.price * item.quantity;
                    }
                }

                setTotalPrice(total);
                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to fetch product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [cartItems]);

    const handleDeliveryInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const isDeliveryInfoComplete = () => {
        return Object.values(deliveryInfo).every(value => value.trim() !== '');
    };

    const handleProceedToCheckout = () => {
        if (isDeliveryInfoComplete()) {
            navigate('/checkout', {
                state: {
                    deliveryInfo,
                    cartItems,
                    totalPrice
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Cart Summary</h1>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading cart items...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Your cart is empty</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                                <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                                <div className="space-y-4">
                                    {cartItems.map((item, index) => (
                                        <CartItem key={index} data={item} />
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={deliveryInfo.name}
                                            onChange={handleDeliveryInputChange}
                                            className="w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={deliveryInfo.email}
                                            onChange={handleDeliveryInputChange}
                                            className="w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={deliveryInfo.phone}
                                            onChange={handleDeliveryInputChange}
                                            className="w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your phone number"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={deliveryInfo.address}
                                            onChange={handleDeliveryInputChange}
                                            className="w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your address"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                value={deliveryInfo.city}
                                                onChange={handleDeliveryInputChange}
                                                className="w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter your city"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                            <input
                                                type="text"
                                                id="country"
                                                name="country"
                                                value={deliveryInfo.country}
                                                onChange={handleDeliveryInputChange}
                                                className="w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter your country"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Delivery Fee</span>
                                        <span className="font-semibold">$5.00</span>
                                    </div>
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-semibold">Total</span>
                                            <span className="text-lg font-bold text-blue-600">${(totalPrice + 5).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleProceedToCheckout}
                                        disabled={!isDeliveryInfoComplete()}
                                        className={`w-full py-3 px-4 rounded-lg transition-colors font-bold text-white
                                            ${isDeliveryInfoComplete()
                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                : 'bg-gray-400 cursor-not-allowed'}`}
                                    >
                                        {isDeliveryInfoComplete()
                                            ? 'Proceed to Checkout'
                                            : 'Please fill in all delivery details'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartSummary; 