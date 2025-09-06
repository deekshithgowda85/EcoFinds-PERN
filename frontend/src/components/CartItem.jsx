import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../stores/Cart';
import { FaTrash } from 'react-icons/fa';
import { apiService } from '../services/api';

const CartItem = ({ data, isReadOnly = false }) => {
    const dispatch = useDispatch();
    const [itemDetails, setItemDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                setLoading(true);
                let response;
                if (data.source === 'products') {
                    response = await apiService.getProduct(data.productId);
                } else if (data.source === 'groceries') {
                    response = await apiService.getGrocery(data.productId);
                }

                if (response && response.data) {
                    setItemDetails(response.data);
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching item details:', err);
                setError('Failed to load item details');
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetails();
    }, [data.productId, data.source]);

    const handleRemove = () => {
        dispatch(removeFromCart({ productId: data.productId, source: data.source }));
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity > 0) {
            dispatch(updateQuantity({ productId: data.productId, quantity: newQuantity, source: data.source }));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="animate-pulse flex space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !itemDetails) {
        return (
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-red-500">Failed to load item details</div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
                <img
                    src={itemDetails.image?.startsWith('http') ? itemDetails.image : `http://localhost:5000${itemDetails.image}`}
                    alt={itemDetails.name}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                        console.error('Image failed to load:', itemDetails.image);
                        e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                    }}
                />
                <div>
                    <h3 className="font-medium text-gray-900">{itemDetails.name}</h3>
                    <p className="text-gray-600">${itemDetails.price}</p>
                </div>
            </div>
            {!isReadOnly ? (
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handleQuantityChange(data.quantity - 1)}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            disabled={data.quantity <= 1}
                        >
                            -
                        </button>
                        <span className="w-8 text-center">{data.quantity}</span>
                        <button
                            onClick={() => handleQuantityChange(data.quantity + 1)}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            +
                        </button>
                    </div>
                    <button
                        onClick={handleRemove}
                        className="text-red-500 hover:text-red-700"
                    >
                        <FaTrash />
                    </button>
                </div>
            ) : (
                <div className="text-gray-600 text-right">
                    <p>Qty: {data.quantity}</p>
                    <p className="text-gray-800 font-semibold">${(itemDetails.price * data.quantity).toFixed(2)}</p>
                </div>
            )}
        </div>
    );
};

export default CartItem;