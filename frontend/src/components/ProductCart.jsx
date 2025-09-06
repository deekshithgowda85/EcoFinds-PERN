import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../stores/Cart';
import { FaShoppingCart, FaHeart, FaStar, FaStarHalfAlt } from 'react-icons/fa';

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

                    {/* Content Section - Clickable */}
                    <Link to={`${basePath}/${id}`} className="flex-1 p-6 flex flex-col justify-between hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-300">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors mb-2 line-clamp-2">
                                {name}
                            </h3>

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

                        {/* Price Section */}
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
                    </Link>

                    {/* Add to Cart Button - Separate from Link */}
                    <div className="p-6 flex items-end">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToCart();
                            }}
                            disabled={isAddingToCart}
                            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-400 disabled:to-indigo-400 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
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
        );
    }

    // Grid view layout (default)
    return (
        <div 
            className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container - Clickable */}
            <Link to={`${basePath}/${id}`} className="block relative overflow-hidden">
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

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{discountPercentage}%
                    </div>
                )}
            </Link>

            {/* Favorite Button - Outside of Link */}
            <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10"
            >
                <FaHeart className={`w-4 h-4 ${isFavorite ? 'text-red-500' : 'text-gray-600'}`} />
            </button>

            {/* Product Info - Clickable */}
            <Link to={`${basePath}/${id}`} className="block p-5 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-300">
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2 line-clamp-2 leading-tight">
                    {name}
                </h3>

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
                <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">
                        ${price}
                    </span>
                    {originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            ${originalPrice}
                        </span>
                    )}
                </div>
            </Link>

            {/* Add to Cart Button - Outside of Link */}
            <div className="px-5 pb-5">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart();
                    }}
                    disabled={isAddingToCart}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-400 disabled:to-indigo-400 text-white py-2.5 rounded-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
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
    );
};

export default ProductCart;