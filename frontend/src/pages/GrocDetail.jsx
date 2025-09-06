import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { addToCart } from '../stores/Cart';
import Navbar from '../components/Navbar';
import { apiService } from '../services/api';
import Footer from '../components/Footer';
import ProductCart from '../components/ProductCart';

const GrocDetail = () => {
    const { id } = useParams();
    const [detail, setDetail] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [relatedElectronics, setRelatedElectronics] = useState([]);
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch main product
                const response = await apiService.getProduct(id);
                if (response && response.data) {
                    setDetail(response.data);
                    setError(null);
                } else {
                    setError('Product not found');
                }

                // Fetch related products and electronics
                try {
                    const [productsRes, electronicsRes] = await Promise.all([
                        apiService.getProducts(),
                        apiService.getElectronics()
                    ]);
                    
                    // Get random 4 items from each
                    if (productsRes?.data) {
                        const shuffled = [...productsRes.data].sort(() => 0.5 - Math.random());
                        setRelatedProducts(shuffled.slice(0, 4));
                    }
                    if (electronicsRes?.data) {
                        const shuffled = [...electronicsRes.data].sort(() => 0.5 - Math.random());
                        setRelatedElectronics(shuffled.slice(0, 4));
                    }
                } catch (relatedError) {
                    console.error('Error fetching related items:', relatedError);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to fetch product details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        } else {
            setError('Invalid product ID');
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
                source: 'products'
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
                        <h2 className="text-2xl font-bold text-red-600 mb-4">{error || 'Product not found'}</h2>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Back to Products
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
                    onClick={() => navigate('/products')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors mb-6"
                >
                    &larr; Back to Products
                </button>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <img
                            src={detail.image?.startsWith('http') ? detail.image : `http://localhost:5000${detail.image}`}
                            alt={detail.name}
                            className='w-full h-64 object-cover rounded-lg'
                            onError={(e) => {
                                console.error('Image failed to load:', detail.image);
                                e.target.src = 'https://via.placeholder.com/300x250?text=No+Image';
                            }}
                        />
                    </div>
                    <div className='lg:col-span-2 flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md'>
                        <h2 className='text-lg text-gray-600'>PRODUCT DETAIL</h2>
                        <h1 className='text-3xl font-bold text-gray-900'>{detail.name}</h1>
                        <p className='font-bold text-2xl text-blue-600'>
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

                {/* Related Products Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
                    
                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Products</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((product, key) => (
                                    <ProductCart 
                                        key={key} 
                                        data={product} 
                                        source="products"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Electronics */}
                    {relatedElectronics.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Electronics</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedElectronics.map((electronic, key) => (
                                    <ProductCart 
                                        key={key} 
                                        data={electronic} 
                                        source="electronics"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default GrocDetail;