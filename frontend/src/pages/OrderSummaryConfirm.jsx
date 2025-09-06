import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from '../components/CartItem';
import { apiService } from '../services/api';
import { removeFromCart, clearCart } from '../stores/Cart';

// Ensure the Razorpay checkout script is included in your index.html file:
// <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

const OrderSummaryConfirm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { deliveryInfo, carts: initialCarts } = location.state || {};
    const dispatch = useDispatch();

    const [carts, setCarts] = useState(initialCarts || []);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const productPromises = carts.map(async (item) => {
                    let response;
                    if (item.source === 'products') {
                        response = await apiService.getProduct(item.productId);
                    } else if (item.source === 'groceries') {
                        response = await apiService.getGrocery(item.productId);
                    }

                    if (response && response.data) {
                        return {
                            ...item,
                            details: response.data
                        };
                    }
                    return null;
                });
                const fetchedProducts = await Promise.all(productPromises);
                const validProducts = fetchedProducts.filter(item => item !== null);
                setProducts(validProducts);
                setError(null);
            } catch (err) {
                setError('Failed to fetch product details');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        if (carts.length > 0) {
            fetchProducts();
        } else {
            if (!location.state) {
                navigate('/cart');
            }
            setProducts([]);
            setLoading(false);
        }
    }, [carts, location.state, navigate]);

    const subtotal = products.reduce((total, product) => total + (product.details.price * product.quantity), 0);
    const deliveryFee = subtotal > 0 ? 5 : 0;
    const total = subtotal + deliveryFee;

    const handleProceedToPayment = async () => {
        if (carts.length === 0) return;

        try {
            // Create order in backend
            const orderResponse = await apiService.createOrder({
                deliveryInfo: deliveryInfo,
                carts: carts,
            });

            const { orderId } = orderResponse;

            // Clear cart and navigate to success page
            dispatch(clearCart());
            navigate('/order-success', {
                state: {
                    orderId: orderId,
                    totalAmount: total
                }
            });

        } catch (err) {
            console.error('Error during checkout process:', err);
            setError(`Checkout failed: ${err.message || 'Unknown error'}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1e1e20]">
                <Navbar />
                <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                    <div className="text-white text-xl">Loading order summary...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#1e1e20]">
                <Navbar />
                <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                    <div className="text-red-500 text-xl">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Order Summary</h1>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {carts.map((item) => (
                                <div key={item.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div>
                                            <h3 className="font-medium">{item.name}</h3>
                                            <p className="text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium">${(item.details.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Delivery Fee</span>
                                <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
                        <div className="space-y-2">
                            <p className="text-gray-700"><span className="font-medium">Name:</span> {deliveryInfo.name}</p>
                            <p className="text-gray-700"><span className="font-medium">Address:</span> {deliveryInfo.address}</p>
                            <p className="text-gray-700"><span className="font-medium">City:</span> {deliveryInfo.city}</p>
                            <p className="text-gray-700"><span className="font-medium">Country:</span> {deliveryInfo.country}</p>
                            <p className="text-gray-700"><span className="font-medium">Phone:</span> {deliveryInfo.phone}</p>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => navigate('/checkout')}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                            Back to Checkout
                        </button>
                        <button
                            onClick={handleProceedToPayment}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                            Confirm Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummaryConfirm;