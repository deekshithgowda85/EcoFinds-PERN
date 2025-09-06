import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { apiService } from '../services/api';
import { toggleStatusTab } from '../stores/Cart';
import { setSearchQuery } from '../stores/Search';
import Navbar from '../components/Navbar';
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin animation-delay-150 mx-auto mt-2 ml-2"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">EcoFinds</h2>
          <p className="text-gray-600 animate-pulse">Loading sustainable products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Intro Animation Overlay */}
      <div className={`fixed inset-0 bg-gradient-to-br from-green-500 to-blue-600 z-50 flex items-center justify-center transition-all duration-1000 ${showContent ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4 animate-bounce">🌱</h1>
          <h2 className="text-4xl font-bold mb-2 animate-fade-in-up">EcoFinds</h2>
          <p className="text-xl animate-fade-in-up animation-delay-300">Discover Sustainable Living</p>
        </div>
      </div>

      <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
        <Navbar />
        
        {/* Enhanced MainBanner with Animation */}
        <div className="relative overflow-hidden">
          <MainBanner />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Selection with Modern Design */}
          <div className="py-12" id="categories">
            <div className="text-center mb-12">
              <h2 className="text-black text-4xl font-bold mb-4 animate-fade-in-up">Shop by Category</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="flex justify-center space-x-6 mb-12">
              <button
                onClick={() => handleCategoryClick('products')}
                className={`group relative px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === 'products'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg border border-gray-200'
                }`}
              >
                <span className="relative z-10">🛍️ Products</span>
                {activeCategory === 'products' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                )}
              </button>
              
              <button
                onClick={() => handleCategoryClick('electronics')}
                className={`group relative px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === 'electronics'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg border border-gray-200'
                }`}
              >
                <span className="relative z-10">⚡ Electronics</span>
                {activeCategory === 'electronics' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                )}
              </button>
            </div>
          </div>

          {/* Products Section with Enhanced Animations */}
          <div className="pb-12" id="featured-products">
            {/* Container for heading, search, and cart button */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-black text-3xl font-bold mb-2 animate-fade-in-left">
                  {activeCategory === 'products' ? '🌟 Featured Products' : '⚡ Smart Electronics'}
                </h2>
                <div className={`w-32 h-1 rounded-full animate-fade-in-left animation-delay-200 ${
                  activeCategory === 'products' 
                    ? 'bg-gradient-to-r from-green-400 to-green-600' 
                    : 'bg-gradient-to-r from-blue-400 to-blue-600'
                }`}></div>
              </div>

              {/* Enhanced Search Input */}
              <div className="ml-8 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative p-5 overflow-hidden w-[60px] h-[60px] hover:w-[300px] bg-white shadow-xl rounded-full flex group items-center hover:duration-500 duration-300 border border-gray-100">
                  <div className="flex items-center justify-center fill-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="Isolation_Mode"
                      data-name="Isolation Mode"
                      viewBox="0 0 24 24"
                      width="22"
                      height="22">
                      <path d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="outline-none text-[18px] bg-transparent w-full text-gray-800 font-normal px-4 placeholder-gray-400"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Search eco-friendly products..."
                  />
                </div>
              </div>

              {/* Enhanced Cart Button */}
              <div 
                className='group relative w-14 h-14 bg-white rounded-2xl flex justify-center items-center cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 border border-gray-100' 
                onClick={handleOpenTabCart}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <img src={iconCart} alt="Cart" className='w-7 relative z-10 filter group-hover:brightness-110 transition-all' />
                {totalQuantity > 0 && (
                  <span className='absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-7 h-7 rounded-full flex justify-center items-center font-bold shadow-lg animate-pulse'>
                    {totalQuantity}
                  </span>
                )}
              </div>
            </div>

            {/* Products Grid with Stagger Animation */}
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6 p-8">
              {getCurrentProducts().map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCart
                    data={product}
                    basePath={activeCategory === 'products' ? '/product' : '/electronics'}
                    source={activeCategory}
                  />
                </div>
              ))}
            </div>

            {/* Enhanced View All Button */}
            <div className="text-center mt-12">
              <Link
                to={activeCategory === 'products' ? '/products' : '/electronics'}
                className={`group relative inline-block px-10 py-4 font-bold text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl ${
                  activeCategory === 'products'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                }`}
              >
                <span className="relative z-10">
                  Explore All {activeCategory === 'products' ? 'Products' : 'Electronics'} →
                </span>
                <div className={`absolute inset-0 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity ${
                  activeCategory === 'products'
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : 'bg-gradient-to-r from-blue-400 to-blue-600'
                }`}></div>
              </Link>
            </div>
          </div>

          {/* Enhanced Why Choose Us Section */}
          <div className="py-20 bg-gradient-to-br from-gray-50 to-white -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>
            
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-black mb-4 animate-fade-in-up">Why Choose EcoFinds?</h2>
                <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">🌱</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-black">100% Eco-Friendly</h3>
                  <p className="text-gray-600 leading-relaxed">Carefully curated sustainable products that help protect our planet for future generations</p>
                </div>
                
                <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">🚚</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-black">Lightning Fast Delivery</h3>
                  <p className="text-gray-600 leading-relaxed">Carbon-neutral shipping with biodegradable packaging delivered straight to your door</p>
                </div>
                
                <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">�</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-black">Premium Quality</h3>
                  <p className="text-gray-600 leading-relaxed">Best-in-class sustainable products at competitive prices with lifetime quality guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Render CartTab */}
        <CartTab />
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out forwards;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default Homescene;