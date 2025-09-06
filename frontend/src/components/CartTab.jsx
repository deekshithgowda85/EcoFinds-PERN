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
                        } else if (item.source === 'groceries') {
                            response = await apiService.getGrocery(item.productId);
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
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleCloseTabCart}></div>
            <div className="fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out">
                <div className="p-6 h-full flex flex-col max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                        <h2 className="text-3xl font-bold text-gray-800">Shopping Cart</h2>
                        <button
                            onClick={handleCloseTabCart}
                            className="text-gray-500 hover:text-gray-700 text-2xl p-2"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto">
                        {loading ? (
                            <div className="text-center text-gray-600 text-lg">Loading cart...</div>
                        ) : error ? (
                            <div className="text-center text-red-500 text-lg">{error}</div>
                        ) : carts.length === 0 ? (
                            <div className="text-center text-gray-600 text-lg">Your cart is empty</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {carts.map((item, index) => (
                                    <CartItem key={index} data={item} />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg">
                            <span className="text-xl text-gray-700 font-medium">Total:</span>
                            <span className="text-2xl font-bold text-gray-800">${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={handleCloseTabCart}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Continue Shopping
                            </button>
                            <button
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => navigate('/cart')}
                                disabled={carts.length === 0 || loading}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CartTab;