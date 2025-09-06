import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/Appcontext';
import { useAuth } from '../context/AuthContext';


function Navbar() {
  const { user } = useAppContext();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white py-6 shadow-md">
      <div className="w-full max-w-[1200px] mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="EcoFinds Logo" className="h-12 w-auto" />
            <span className="text-3xl font-bold text-green-600">EcoFinds</span>
          </Link>
          <nav>
            <ul className="flex items-center gap-6">
              <li>
                <Link to="/" className="text-lg text-black hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-lg text-black hover:text-blue-600">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/electronics" className="text-lg text-black hover:text-blue-600">
                  Electronics
                </Link>
              </li>
              <li>
                {!user ? (
                  <Link to="/login" className="text-lg text-black hover:text-blue-600">
                    Login
                  </Link>
                ) : (
                  <Link to="/profile" className="text-lg text-gray-700 hover:text-black transition-colors">
                    Profile
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;