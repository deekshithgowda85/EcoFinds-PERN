import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiService } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCart from '../components/ProductCart';
import MainBanner from '../components/MainBanner';

function Homescene() {
  const [products, setProducts] = useState([]);
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('products');
  const [showContent, setShowContent] = useState(false);
  
  // Get search query from Redux store
  const searchQuery = useSelector(store => store.search.searchQuery);

  // Intro animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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
    if (!searchQuery) {
      return currentData;
    }
    return currentData.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="relative mb-8 flex justify-center">
            <div className="spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              EcoFinds
            </h2>
            <p className="text-slate-600 font-medium">Loading sustainable products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Oops! Something went wrong</h2>
          <p className="text-red-600 mb-6 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Enhanced Intro Animation Overlay */}
      <div className={`fixed inset-0 bg-gradient-to-br from-white via-gray-50 to-emerald-50 z-50 flex items-center justify-center transition-all duration-1000 ease-out ${showContent ? 'opacity-0 pointer-events-none scale-110' : 'opacity-100 scale-100'}`}>
        <div className="text-center text-gray-800">
          <div className="relative mb-8 flex justify-center">
            <div className="spinner intro-spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
            EcoFinds
          </h2>
          <p className="text-gray-600 text-lg font-medium">Discover Sustainable Products</p>
          <div className="mt-6 w-32 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full mx-auto"></div>
        </div>
      </div>

      <div className={`transition-all duration-1000 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Navbar />
        
        {/* Enhanced Main Banner */}
        <div className="relative overflow-hidden">
          <MainBanner />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Category Selection */}
          <div className="py-12" id="categories">
            <div className="mb-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-3">
                  Shop by Category
                </h2>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  Explore our carefully curated collection of sustainable products
                </p>
              </div>
              
              <div className="flex justify-center space-x-2 bg-white p-2 rounded-2xl shadow-lg border border-slate-100 w-fit mx-auto">
                <button
                  onClick={() => handleCategoryClick('products')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeCategory === 'products'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span>Products</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleCategoryClick('electronics')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeCategory === 'electronics'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span>Electronics</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Products Section */}
          <div className="pb-16" id="featured-products">
            {/* Enhanced Header */}
            <div className="mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">
                  {activeCategory === 'products' ? 'Featured Products' : 'Smart Electronics'}
                </h2>
                <p className="text-slate-600 text-lg">
                  {activeCategory === 'products' 
                    ? 'Sustainable products for conscious living' 
                    : 'Innovative electronics for the modern world'
                  }
                </p>
              </div>
            </div>

            {/* Enhanced Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {getCurrentProducts().map((product, index) => (
                <div 
                  key={product.id} 
                  className="opacity-0 animate-fade-in-up transform hover:scale-105 transition-all duration-300"
                  style={{ 
                    animationDelay: `${index * 100}ms`, 
                    animationFillMode: 'forwards',
                    animationDuration: '0.6s'
                  }}
                >
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden">
                    <ProductCart
                      data={product}
                      basePath={activeCategory === 'products' ? '/product' : '/electronics'}
                      source={activeCategory}
                    />
                  </div>
                </div>
              ))}
            </div>

            {getCurrentProducts().length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No products found</h3>
                <p className="text-slate-600">Try adjusting your search terms</p>
              </div>
            )}

            {/* Enhanced View All Button */}
            {getCurrentProducts().length > 0 && (
              <div className="text-center mt-16">
                <Link
                  to={activeCategory === 'products' ? '/products' : '/electronics'}
                  className="group inline-flex items-center px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>View All {activeCategory === 'products' ? 'Products' : 'Electronics'}</span>
                  <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Enhanced Why Choose Us Section */}
          <div className="py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-white to-emerald-50/50 border border-slate-100 rounded-3xl p-12 shadow-sm">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose EcoFinds?</h2>
                  <p className="text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed">
                    We're committed to providing sustainable products that make a positive impact on the environment while delivering exceptional quality and value
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-10">
                  <div className="text-center group hover:scale-105 transition-all duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
                      <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-slate-900">100% Eco-Friendly</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Carefully curated sustainable products that help protect our planet for future generations with verified eco-certifications
                    </p>
                  </div>
                  
                  <div className="text-center group hover:scale-105 transition-all duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
                      <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-slate-900">Fast Delivery</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Carbon-neutral shipping with sustainable packaging delivered quickly to your door, ensuring minimal environmental impact
                    </p>
                  </div>
                  
                  <div className="text-center group hover:scale-105 transition-all duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
                      <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-slate-900">Premium Quality</h3>
                    <p className="text-slate-600 leading-relaxed">
                      High-quality sustainable products at competitive prices with excellent customer support and satisfaction guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
      
      {/* Enhanced CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up ease-out;
        }

        @keyframes bounce-gentle {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-4px);
          }
          60% {
            transform: translateY(-2px);
          }
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s infinite;
        }

        .spinner {
          position: relative;
          width: 30px;
          height: 30px;
        }

        .spinner div {
          position: absolute;
          width: 30%;
          height: 150%;
          background: #ffffff;
          transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
          animation: spinner-fzua35 1s calc(var(--delay) * 1s) infinite ease;
          border-radius: 2px;
        }

        .intro-spinner div {
          background: #10b981;
        }

        .spinner div:nth-child(1) {
          --delay: 0.1;
          --rotation: 36;
          --translation: 150;
        }

        .spinner div:nth-child(2) {
          --delay: 0.2;
          --rotation: 72;
          --translation: 150;
        }

        .spinner div:nth-child(3) {
          --delay: 0.3;
          --rotation: 108;
          --translation: 150;
        }

        .spinner div:nth-child(4) {
          --delay: 0.4;
          --rotation: 144;
          --translation: 150;
        }

        .spinner div:nth-child(5) {
          --delay: 0.5;
          --rotation: 180;
          --translation: 150;
        }

        .spinner div:nth-child(6) {
          --delay: 0.6;
          --rotation: 216;
          --translation: 150;
        }

        .spinner div:nth-child(7) {
          --delay: 0.7;
          --rotation: 252;
          --translation: 150;
        }

        .spinner div:nth-child(8) {
          --delay: 0.8;
          --rotation: 288;
          --translation: 150;
        }

        .spinner div:nth-child(9) {
          --delay: 0.9;
          --rotation: 324;
          --translation: 150;
        }

        .spinner div:nth-child(10) {
          --delay: 1;
          --rotation: 360;
          --translation: 150;
        }

        @keyframes spinner-fzua35 {
          0%, 10%, 20%, 30%, 40%, 60%, 70%, 80%, 90%, 100% {
            transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
          }

          50% {
            transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1.5%));
          }
        }
      `}</style>
    </div>
  );
}

export default Homescene;