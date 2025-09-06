import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../stores/Cart';
import { FaShoppingCart, FaHeart, FaEye, FaStar, FaStarHalfAlt } from 'react-icons/fa';

const ProductCart = (props) => {
    const { id, name, price, image, rating = 4.5, reviews = 0, originalPrice, discount } = props.data;
    const { basePath = '/product', source, viewMode = 'grid' } = props;
    const [isHovered, setIsHovered] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const dispatch = useDispatch();

    const handleAddToCart = async () => {
        setIsAddingToCart(true);
        dispatch(addToCart({
            productId: id,
            quantity: 1,
            source: source
        }));
        
        // Simulate loading state
        setTimeout(() => {
            setIsAddingToCart(false);
        }, 600);
    };

    const toggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };

    // Construct the full image URL
    const imageUrl = image?.startsWith('http') ? image : `http://localhost:5000${image}`;

    // Calculate discount percentage if originalPrice exists
    const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : discount;

    // Render stars for rating
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} className="text-yellow-400 w-3 h-3" />);
        }
        
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 w-3 h-3" />);
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaStar key={`empty-${i}`} className="text-gray-300 w-3 h-3" />);
        }
        
        return stars;
    };

    // List view layout
    if (viewMode === 'list') {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                    {/* Image Section */}
                    <div className="relative sm:w-48 h-48 sm:h-auto flex-shrink-0">
                        <Link to={`${basePath}/${id}`} className="block h-full">
                            <img
                                src={imageUrl}
                                alt={name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                }}
                            />
                        </Link>
                        
                        {/* Discount Badge */}
                        {discountPercentage > 0 && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                                -{discountPercentage}%
                            </div>
                        )}

                        {/* Favorite Button */}
                        <button
                            onClick={toggleFavorite}
                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                        >
                            <FaHeart className={`w-4 h-4 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`} />
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                            <Link to={`${basePath}/${id}`} className="block">
                                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                                    {name}
                                </h3>
                            </Link>

                            {/* Rating */}
                            <div className="flex items-center mb-3">
                                <div className="flex items-center space-x-1">
                                    {renderStars()}
                                </div>
                                <span className="text-sm text-gray-500 ml-2">
                                    {rating} ({reviews} reviews)
                                </span>
                            </div>
                        </div>

                        {/* Price and Action Section */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold text-gray-900">
                                    ${price}
                                </span>
                                {originalPrice && (
                                    <span className="text-lg text-gray-500 line-through">
                                        ${originalPrice}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={isAddingToCart}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium"
                            >
                                {isAddingToCart ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaShoppingCart className="w-4 h-4" />
                                        <span>Add to Cart</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Grid view layout (default)
    return (
        <div 
            className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative overflow-hidden">
                <Link to={`${basePath}/${id}`} className="block">
                    <div className="aspect-square w-full bg-gray-100">
                        <img
                            src={imageUrl}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                            }}
                        />
                    </div>
                </Link>

                {/* Overlay Actions */}
                <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute top-4 right-4 flex flex-col space-y-2">
                        <button
                            onClick={toggleFavorite}
                            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                        >
                            <FaHeart className={`w-4 h-4 ${isFavorite ? 'text-red-500' : 'text-gray-600'}`} />
                        </button>
                        <Link 
                            to={`${basePath}/${id}`}
                            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                        >
                            <FaEye className="w-4 h-4 text-gray-600" />
                        </Link>
                    </div>
                </div>

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{discountPercentage}%
                    </div>
                )}

                {/* Quick Add Button - Shows on Hover */}
                <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                    >
                        {isAddingToCart ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Adding...</span>
                            </>
                        ) : (
                            <>
                                <FaShoppingCart className="w-4 h-4" />
                                <span>Quick Add</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-5">
                <Link to={`${basePath}/${id}`} className="block">
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2 leading-tight">
                        {name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center mb-3">
                    <div className="flex items-center space-x-1">
                        {renderStars()}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                        ({reviews})
                    </span>
                </div>

                {/* Price Section */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">
                            ${price}
                        </span>
                        {originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                                ${originalPrice}
                            </span>
                        )}
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2 group"
                >
                    {isAddingToCart ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Adding...</span>
                        </>
                    ) : (
                        <>
                            <FaShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>Add to Cart</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductCart;