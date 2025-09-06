import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { addToCart } from '../stores/Cart';
import Navbar from '../components/Navbar';
import { apiService } from '../services/api';
import Footer from '../components/Footer';

const Detail = () => {
    const { id } = useParams();
    const [detail, setDetail] = useState(null);
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchGrocery = async () => {
            try {
                setLoading(true);
                const response = await apiService.getGrocery(id);
                if (response && response.data) {
                    setDetail(response.data);
                    setError(null);
                } else {
                    setError('Grocery item not found');
                }
            } catch (err) {
                console.error('Error fetching grocery:', err);
                setError('Failed to fetch grocery details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchGrocery();
        } else {
            setError('Invalid grocery ID');
            setLoading(false);
        }
    }, [id]);

    const handleMinusQuantity = () => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity - 1));
    }

    const handlePlusQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    }

    const handleAddToCart = () => {
        if (detail) {
            dispatch(addToCart({
                productId: detail.id,
                quantity: quantity,
                source: 'groceries'
            }));
            // Optional: Show a success message or notification here
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="h-96 bg-gray-200 rounded"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !detail) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">{error || 'Grocery item not found'}</h2>
                        <button
                            onClick={() => navigate('/groceries')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Back to Groceries
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/groceries')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors mb-6"
                >
                    &larr; Back to Groceries
                </button>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <img
                            src={detail.image?.startsWith('http') ? detail.image : `http://localhost:5000${detail.image}`}
                            alt={detail.name}
                            className='w-full h-auto object-contain rounded-lg'
                            onError={(e) => {
                                console.error('Image failed to load:', detail.image);
                                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                            }}
                        />
                    </div>
                    <div className='flex flex-col gap-5 bg-white p-6 rounded-lg shadow-md'>
                        <h2 className='text-xl text-gray-600'>GROCERY DETAIL</h2>
                        <h1 className='text-4xl font-bold text-gray-900'>{detail.name}</h1>
                        <p className='font-bold text-3xl text-blue-600'>
                            ${detail.price}
                        </p>
                        <div className='flex gap-4 items-center mt-4'>
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={handleMinusQuantity}
                                    className='bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded transition-colors'
                                >
                                    -
                                </button>
                                <span className='text-xl font-medium'>{quantity}</span>
                                <button
                                    onClick={handlePlusQuantity}
                                    className='bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded transition-colors'
                                >
                                    +
                                </button>
                            </div>
                            <button
                                className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md shadow-lg transition-colors'
                                onClick={handleAddToCart}
                            >
                                Add To Cart
                            </button>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {detail.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Detail;