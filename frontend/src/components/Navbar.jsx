import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/Appcontext';
import { useAuth } from '../context/AuthContext';

// Icons for enhanced UI
import {
  FaLeaf,
  FaHome,
  FaShoppingBag,
  FaLaptop,
  FaUser,
  FaSignInAlt,
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaSearch,
  FaChevronDown,
  FaSignOutAlt,
  FaBox
} from 'react-icons/fa';

function Navbar() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if current path is active
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Navigation items with icons and descriptions
  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: <FaHome className="w-4 h-4" />,
      description: 'Dashboard & Featured Products'
    },
    { 
      path: '/products', 
      label: 'Products', 
      icon: <FaShoppingBag className="w-4 h-4" />,
      description: 'Sustainable Everyday Items'
    },
    { 
      path: '/electronics', 
      label: 'Electronics', 
      icon: <FaLaptop className="w-4 h-4" />,
      description: 'Smart Eco-Friendly Tech'
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProfileDropdownOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    // Add logout logic here
    console.log('Logout clicked');
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-lg shadow-slate-900/5' 
          : 'bg-white/80 backdrop-blur-md border-b border-slate-200/30'
      }`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Enhanced Logo Section */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 hover:opacity-90 transition-all duration-300 group"
              onClick={closeMobileMenu}
            >
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <FaLeaf className="text-white text-lg group-hover:rotate-12 transition-transform duration-300" />
                </div>
                {/* Enhanced eco indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 bg-clip-text text-transparent">
                    EcoFinds
                  </span>
                  <div className="text-xs text-slate-500 font-medium -mt-1">Sustainable Shopping</div>
                </div>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => (
                <div key={item.path} className="relative group">
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      isActiveRoute(item.path)
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 hover:shadow-sm'
                    }`}
                  >
                    <div className={`transition-transform duration-300 ${isActiveRoute(item.path) ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {item.icon}
                    </div>
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                  
                  {/* Tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                      {item.description}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                  </div>
                </div>
              ))}
            </nav>

            {/* Enhanced Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Enhanced Search Button */}
              <div className="relative">
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="hidden md:flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 transition-all duration-300 hover:scale-105 hover:shadow-md group"
                >
                  <FaSearch className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
                
                {/* Search Dropdown */}
                {isSearchOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                        autoFocus
                      />
                    </div>
                    <div className="mt-3 text-xs text-slate-500">
                      Press <kbd className="px-2 py-1 bg-slate-200 rounded">Enter</kbd> to search
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Cart Button */}
              <button 
                onClick={() => navigate('/cart')}
                className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 transition-all duration-300 hover:scale-105 hover:shadow-md group"
              >
                <FaShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {/* Enhanced cart badge */}
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  0
                </span>
              </button>

              {/* Enhanced User Section */}
              {!user ? (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <FaSignInAlt className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 transition-all duration-300 hover:shadow-md group"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                      <FaUser className="text-white text-sm" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="font-semibold text-slate-700 text-sm">
                        {user.name || user.username}
                      </div>
                      <div className="text-xs text-slate-500">Premium Member</div>
                    </div>
                    <FaChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Enhanced Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                            <FaUser className="text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{user.name || user.username}</div>
                            <div className="text-sm text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <FaUser className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">My Profile</div>
                            <div className="text-xs text-slate-500">Account settings</div>
                          </div>
                        </Link>
                        
                        <Link
                          to="/orders"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <FaBox className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">My Orders</div>
                            <div className="text-xs text-slate-500">Track your purchases</div>
                          </div>
                        </Link>
                      </div>

                      <hr className="my-2 border-slate-100" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors group"
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                          <FaSignOutAlt className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <div className="font-medium">Sign Out</div>
                          <div className="text-xs text-slate-500">See you soon!</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 transition-all duration-300 hover:scale-105"
              >
                <div className="relative w-5 h-5">
                  <span className={`absolute top-0 left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`absolute top-2 left-0 w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`absolute top-4 left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`} ref={mobileMenuRef}>
          <nav className="px-4 py-6 space-y-2 max-w-7xl mx-auto">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-4 px-4 py-4 rounded-xl font-medium transition-all duration-300 ${
                  isActiveRoute(item.path)
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isActiveRoute(item.path) ? 'bg-white/20' : 'bg-slate-100'
                }`}>
                  {item.icon}
                </div>
                <div>
                  <div className="font-semibold">{item.label}</div>
                  <div className={`text-xs ${isActiveRoute(item.path) ? 'text-white/80' : 'text-slate-500'}`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}
            
            {/* Mobile Search */}
            <div className="px-4 py-2">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Mobile Login Button */}
            {!user && (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center space-x-4 px-4 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 mx-4 mt-4 shadow-lg"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <FaSignInAlt className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold">Sign In</div>
                  <div className="text-xs text-white/80">Access your account</div>
                </div>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Click outside overlay */}
      {(isProfileDropdownOpen || isSearchOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" 
          onClick={() => {
            setIsProfileDropdownOpen(false);
            setIsSearchOpen(false);
          }}
        ></div>
      )}

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}

export default Navbar;