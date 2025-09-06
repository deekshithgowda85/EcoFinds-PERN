import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { apiService } from '../services/api';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { deliveryInfo, cartItems, totalPrice } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: ''
    });

    useEffect(() => {
        if (!deliveryInfo || !cartItems) {
            navigate('/cart');
        }
    }, [deliveryInfo, cartItems, navigate]);

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const isCardDetailsComplete = () => {
        return Object.values(cardDetails).every(value => value.trim() !== '');
    };

    const handlePlaceOrder = async () => {
        if (!isCardDetailsComplete()) {
            setError('Please fill in all card details');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const orderData = {
                deliveryInfo,
                carts: cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    source: item.source
                }))
            };

            const response = await apiService.createOrder(orderData);

            if (response && response.orderId) {
                navigate('/order-success', {
                    state: {
                        orderId: response.orderId,
                        totalAmount: totalPrice + 5
                    }
                });
            } else {
                throw new Error('Failed to create order');
            }
        } catch (err) {
            console.error('Error placing order:', err);
            setError('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!deliveryInfo || !cartItems) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
                            <div className="space-y-2 text-gray-600">
                                <p><span className="font-semibold">Name:</span> {deliveryInfo.name}</p>
                                <p><span className="font-semibold">Email:</span> {deliveryInfo.email}</p>
                                <p><span className="font-semibold">Phone:</span> {deliveryInfo.phone}</p>
                                <p><span className="font-semibold">Address:</span> {deliveryInfo.address}</p>
                                <p><span className="font-semibold">City:</span> {deliveryInfo.city}</p>
                                <p><span className="font-semibold">Country:</span> {deliveryInfo.country}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="radio"
                                        id="credit_card"
                                        name="paymentMethod"
                                        value="credit_card"
                                        checked={paymentMethod === 'credit_card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    <label htmlFor="credit_card" className="text-gray-700">Credit Card</label>
                                </div>

                                {paymentMethod === 'credit_card' && (
                                    <div className="space-y-4 mt-4">
                                        <div>
                                            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                                            <input
                                                type="text"
                                                id="cardName"
                                                name="cardName"
                                                value={cardDetails.cardName}
                                                onChange={handleCardInputChange}
                                                className="w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter cardholder name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                            <input
                                                type="text"
                                                id="cardNumber"
                                                name="cardNumber"
                                                value={cardDetails.cardNumber}
                                                onChange={handleCardInputChange}
                                                className="w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter card number"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    id="expiryDate"
                                                    name="expiryDate"
                                                    value={cardDetails.expiryDate}
                                                    onChange={handleCardInputChange}
                                                    className="w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="MM/YY"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                                <input
                                                    type="text"
                                                    id="cvv"
                                                    name="cvv"
                                                    value={cardDetails.cvv}
                                                    onChange={handleCardInputChange}
                                                    className="w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="CVV"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
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
                                {error && (
                                    <div className="text-red-500 text-sm mt-2">
                                        {error}
                                    </div>
                                )}
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading || !isCardDetailsComplete()}
                                    className={`w-full py-3 px-4 rounded-lg transition-colors font-bold text-white
                                        ${loading || !isCardDetailsComplete()
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {loading ? 'Processing...' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout; 