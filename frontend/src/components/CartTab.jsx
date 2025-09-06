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
            <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
                <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
                        <button
                            onClick={handleCloseTabCart}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto">
                        {loading ? (
                            <div className="text-center text-gray-600">Loading cart...</div>
                        ) : error ? (
                            <div className="text-center text-red-500">{error}</div>
                        ) : carts.length === 0 ? (
                            <div className="text-center text-gray-600">Your cart is empty</div>
                        ) : (
                            <div className="space-y-4">
                                {carts.map((item, index) => (
                                    <CartItem key={index} data={item} />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600">Total:</span>
                            <span className="text-xl font-semibold text-gray-800">${totalPrice.toFixed(2)}</span>
                        </div>
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => navigate('/cart')}
                            disabled={carts.length === 0 || loading}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CartTab;