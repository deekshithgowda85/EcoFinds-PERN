import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { apiService } from '../services/api';
import ProductCart from '../components/ProductCart';
import { useSelector, useDispatch } from 'react-redux';
import { toggleStatusTab } from '../stores/Cart';
import iconCart from '../assets/images/iconCart.png';
import { setSearchQuery } from '../stores/Search';
import CartTab from '../components/CartTab';
import MainBanner from '../components/MainBanner';
import Footer from '../components/Footer';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState('all');
  
  const carts = useSelector(store => store.cart.items);
  const dispatch = useDispatch();
  const searchQuery = useSelector(store => store.search.searchQuery);

  useEffect(() => {
    let total = 0;
    carts.forEach(item => total += item.quantity);
    setTotalQuantity(total);
  }, [carts]);

  const handleOpenTabCart = () => {
    console.log('Cart button clicked!');
    dispatch(toggleStatusTab());
  };

  const handleSearchInputChange = (event) => {
    dispatch(setSearchQuery(event.target.value));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts();
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getFilteredAndSortedProducts = () => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply price filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        switch (priceRange) {
          case 'under25': return price < 25;
          case '25to50': return price >= 25 && price <= 50;
          case '50to100': return price >= 50 && price <= 100;
          case 'over100': return price > 100;
          default: return true;
        }
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'priceLow':
        return filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'priceHigh':
        return filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'nameAZ':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'nameZA':
        return filtered.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return filtered;
    }
  };

  const filteredProducts = getFilteredAndSortedProducts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin animation-delay-150 mx-auto mt-2 ml-2"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Products</h2>
            <p className="text-gray-600 animate-pulse">Discovering amazing products for you...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center p-8 bg-white rounded-3xl shadow-2xl max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-red-500 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navbar />

      {/* Hero Section with Breadcrumbs */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <nav className="text-sm mb-4 opacity-80">
              <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
              <span className="mx-2">›</span>
              <span>Products</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Featured Products
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover our carefully curated collection of premium products designed for modern living
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Controls Bar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Left Side - Results Count & View Toggle */}
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products found
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Grid View"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="List View"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Center - Search Bar */}
            <div className="flex-1 max-w-md mx-auto lg:mx-0">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="flex items-center">
                    <div className="pl-4 pr-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="flex-1 py-3 pr-4 text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none focus:ring-0"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      placeholder="Search products..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Filters & Cart */}
            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="featured">Featured</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="nameAZ">Name: A-Z</option>
                <option value="nameZA">Name: Z-A</option>
              </select>

              {/* Price Filter */}
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="under25">Under $25</option>
                <option value="25to50">$25 - $50</option>
                <option value="50to100">$50 - $100</option>
                <option value="over100">Over $100</option>
              </select>

              {/* Enhanced Cart Button */}
              <button
                onClick={handleOpenTabCart}
                className="relative group p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <img src={iconCart} alt="Cart" className="w-6 h-6 filter brightness-0 invert" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce">
                    {totalQuantity}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity -z-10"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className="pb-12">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8' 
                : 'space-y-4'
            } transition-all duration-300`}>
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className={`group transform transition-all duration-300 hover:scale-105 ${
                    viewMode === 'list' ? 'flex items-center space-x-6 p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl' : ''
                  }`}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <ProductCart
                    data={product}
                    basePath="/product"
                    source="products"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Load More Button (if needed) */}
        {filteredProducts.length > 0 && (
          <div className="text-center pb-12">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold">
              Load More Products
            </button>
          </div>
        )}
      </div>

      {/* Enhanced CartTab */}
      <CartTab />

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animation-delay-150 {
          animation-delay: 150ms;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      <Footer />
    </div>
  );
}

export default ProductPage;