import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { apiService } from '../services/api';
import { toggleStatusTab } from '../stores/Cart';
import { setSearchQuery } from '../stores/Search';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCart from '../components/ProductCart';
import CartTab from '../components/CartTab';
import MainBanner from '../components/MainBanner';
import iconCart from '../assets/images/iconCart.png';

function Homescene() {
  const [products, setProducts] = useState([]);
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('products');
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [showContent, setShowContent] = useState(false);
  
  const carts = useSelector(store => store.cart.items);
  const dispatch = useDispatch();
  const searchQuery = useSelector(store => store.search.searchQuery);

  useEffect(() => {
    let total = 0;
    carts.forEach(item => total += item.quantity);
    setTotalQuantity(total);
  }, [carts]);

  // Intro animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenTabCart = () => {
    dispatch(toggleStatusTab());
  };

  const handleSearchInputChange = (event) => {
    dispatch(setSearchQuery(event.target.value));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [productsResponse, electronicsResponse] = await Promise.all([
          apiService.getProducts(),
          apiService.getElectronics()
        ]);
        
        setProducts(productsResponse.data);
        setElectronics(electronicsResponse.data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const getCurrentProducts = () => {
    const currentData = activeCategory === 'products' ? products : electronics;
    return currentData.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">EcoFinds</h2>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-4xl mb-4 text-red-500">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Intro Animation Overlay */}
      <div className={`fixed inset-0 bg-slate-900 z-50 flex items-center justify-center transition-all duration-700 ease-in-out ${showContent ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">EcoFinds</h2>
          <p className="text-gray-300">Discover Sustainable Products</p>
        </div>
      </div>

      <div className={`transition-all duration-700 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar />
        
        {/* Main Banner */}
        <div className="relative">
          <MainBanner />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Selection - Amazon Style */}
          <div className="py-8" id="categories">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => handleCategoryClick('products')}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    activeCategory === 'products'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  Products
                </button>
                
                <button
                  onClick={() => handleCategoryClick('electronics')}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    activeCategory === 'electronics'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  Electronics
                </button>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="pb-12" id="featured-products">
            {/* Header with Search and Cart */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {activeCategory === 'products' ? 'Featured Products' : 'Electronics'}
                </h2>
                <p className="text-gray-600">
                  {activeCategory === 'products' 
                    ? 'Sustainable products for everyday life' 
                    : 'Smart electronics for modern living'
                  }
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Professional Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Search products..."
                  />
                </div>

                {/* Modern Cart Button */}
                <button
                  onClick={handleOpenTabCart}
                  className="relative p-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                >
                  <img src={iconCart} alt="Cart" className="w-6 h-6" />
                  {totalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium">
                      {totalQuantity}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getCurrentProducts().map((product, index) => (
                <div 
                  key={product.id} 
                  className="opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <ProductCart
                    data={product}
                    basePath={activeCategory === 'products' ? '/product' : '/electronics'}
                    source={activeCategory}
                  />
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Link
                to={activeCategory === 'products' ? '/products' : '/electronics'}
                className="inline-flex items-center px-8 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors shadow-sm"
              >
                View All {activeCategory === 'products' ? 'Products' : 'Electronics'}
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="py-16 bg-white -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose EcoFinds?</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  We're committed to providing sustainable products that make a positive impact on the environment
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">100% Eco-Friendly</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Carefully curated sustainable products that help protect our planet for future generations
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Fast Delivery</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Carbon-neutral shipping with sustainable packaging delivered quickly to your door
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Premium Quality</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    High-quality sustainable products at competitive prices with excellent customer support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Render CartTab */}
        <CartTab />
        
        {/* Footer */}
        <Footer />
      </div>
      
      {/* Simplified CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Homescene;