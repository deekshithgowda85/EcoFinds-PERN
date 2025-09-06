import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FaLeaf, 
    FaFacebook, 
    FaTwitter, 
    FaInstagram,
    FaEnvelope,
    FaHeart,
    FaShieldAlt,
    FaTruck
} from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 mt-12 border-t border-gray-200">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                                <FaLeaf className="text-xl text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">EcoFinds</h3>
                                <p className="text-emerald-600 text-sm">Sustainable Shopping</p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            Discover eco-friendly electronics and sustainable products. 
                            Shop with purpose for a better tomorrow.
                        </p>
                        
                        {/* Quick Features */}
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center space-x-2 text-gray-600">
                                <FaTruck className="text-emerald-500" />
                                <span>Free Shipping</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                                <FaShieldAlt className="text-emerald-500" />
                                <span>Secure Payment</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/products" className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 text-sm">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/electronics" className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 text-sm">
                                    Electronics
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 text-sm">
                                    My Account
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Connect</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-gray-600 text-sm">
                                <FaEnvelope className="text-emerald-500" />
                                <span>hello@ecofinds.com</span>
                            </div>
                        </div>
                        
                        {/* Social Media */}
                        <div className="flex items-center space-x-3 mt-4">
                            <a href="#" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors duration-200 shadow-sm">
                                <FaFacebook className="text-lg" />
                            </a>
                            <a href="#" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-400 hover:border-blue-200 transition-colors duration-200 shadow-sm">
                                <FaTwitter className="text-lg" />
                            </a>
                            <a href="#" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-pink-600 hover:border-pink-200 transition-colors duration-200 shadow-sm">
                                <FaInstagram className="text-lg" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-500 text-sm">
                            © {currentYear} EcoFinds. All rights reserved. Made with{' '}
                            <FaHeart className="inline text-red-500 mx-1" />
                            for the planet.
                        </p>
                        <div className="flex space-x-6 text-xs">
                            <a href="#" className="text-gray-500 hover:text-emerald-600 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-500 hover:text-emerald-600 transition-colors">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
