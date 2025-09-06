import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/Appcontext';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

// Icons for enhanced UI
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaLeaf, 
  FaShieldAlt,
  FaArrowRight,
  FaExclamationCircle
} from 'react-icons/fa';

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Business logic remains unchanged
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login({
        username: username.trim(),
        password: password
      });

      if (result.success && result.user) {
        setUser(result.user);
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl shadow-lg mb-4">
            <FaLeaf className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back!</h1>
          <p className="text-slate-600">
            First time here?{' '}
            <Link 
              to="/register" 
              className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3 animate-shake">
                <FaExclamationCircle className="text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all bg-white/70"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  minLength="6"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all bg-white/70"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-emerald-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-slate-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-slate-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500 flex items-center space-x-1">
                <FaShieldAlt className="h-3 w-3" />
                <span>Password must be at least 6 characters</span>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FaArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Additional Options */}
            <div className="flex items-center justify-between text-sm">
              <Link 
                to="/forgot-password" 
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
              <div className="flex items-center space-x-2">
                <FaShieldAlt className="h-4 w-4 text-slate-400" />
                <span className="text-slate-500">Secure login</span>
              </div>
            </div>
          </form>
        </div>

        {/* Terms and Privacy */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 leading-relaxed">
            By signing in, you agree to our{' '}
            <a 
              href="#" 
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a 
              href="#" 
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Features Highlight */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <FaLeaf className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-xs text-slate-600 font-medium">Sustainable</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <FaShieldAlt className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-xs text-slate-600 font-medium">Secure</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <FaUser className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-xs text-slate-600 font-medium">Personal</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

export default Login;