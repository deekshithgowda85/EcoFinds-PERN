import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/Appcontext';
import { useAuth } from '../context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery } from '../stores/Search';
import { toggleStatusTab } from '../stores/Cart';

function Navbar() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchQuery = useSelector(store => store.search.searchQuery);
  const carts = useSelector(store => store.cart.items);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    let total = 0;
    carts.forEach(item => total += item.quantity);
    setTotalQuantity(total);
  }, [carts]);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const clearSearch = () => {
    dispatch(setSearchQuery(''));
  };

  const handleOpenTabCart = () => {
    dispatch(toggleStatusTab());
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left Edge */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="/logo.png" 
              alt="EcoFinds Logo" 
              className="w-10 h-10 rounded-lg object-contain"
            />
            <span className="text-2xl font-bold text-emerald-600">
              EcoFinds
            </span>
          </Link>

          {/* Center - Search Bar */}
          <div className="hidden md:block relative flex-1 max-w-md mx-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white text-sm transition-all duration-300"
              placeholder="Search products..."
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
              >
                <span className="text-gray-400">✕</span>
              </button>
            )}
          </div>

          {/* Right Side - Navigation + User Menu */}
          <div className="flex items-center space-x-6">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link 
                to="/" 
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200 text-base font-medium"
              >
                <span>Home</span>
              </Link>
              <Link 
                to="/electronics" 
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200 text-base font-medium"
              >
                <span>Electronics</span>
              </Link>
              <Link 
                to="/products" 
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200 text-base font-medium"
              >
                <span>Products</span>
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={handleOpenTabCart}
                className="relative p-2 text-gray-700 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-3 2m3-2v4a2 2 0 002 2h8a2 2 0 002-2v-4" />
                </svg>
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {totalQuantity}
                  </span>
                )}
              </button>

              {/* Profile/Login */}
              {!user ? (
                <Link 
                  to="/login" 
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  <span>Sign In</span>
                </Link>
              ) : (
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-3 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-black text-sm">👤</span>
                  </div>
                  <span className="hidden lg:block font-medium">Profile</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
              >
                <div className="w-5 h-5 flex flex-col justify-center items-center">
                  <span className={`bg-current block transition-all duration-300 h-0.5 w-5 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                  <span className={`bg-current block transition-all duration-300 h-0.5 w-5 my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`bg-current block transition-all duration-300 h-0.5 w-5 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 space-y-2 border-t border-gray-200 mt-4">
            {/* Mobile Search */}
            <div className="px-2 mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white text-sm transition-all duration-300"
                  placeholder="Search products..."
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                  >
                    <span className="text-gray-400">✕</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>🏠</span>
              <span>Home</span>
            </Link>
            <Link 
              to="/products" 
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>🛍️</span>
              <span>Products</span>
            </Link>
            <Link 
              to="/electronics" 
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>💻</span>
              <span>Electronics</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;