import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import Footer from '../components/Footer';

// Icons for enhanced UI
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaLeaf, 
  FaShieldAlt,
  FaArrowRight,
  FaExclamationCircle,
  FaCheckCircle,
  FaArrowLeft,
  FaClock,
  FaRedo
} from 'react-icons/fa';

function Register() {
  const [step, setStep] = useState(1); // 1: Registration, 2: OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [tempUserId, setTempUserId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  // Timer for resend button
  React.useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Business logic remains unchanged
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.sendRegistrationOtp({
        email: formData.email,
        username: formData.username,
        password: formData.password
      });
      setTempUserId(response.data.tempUserId);
      setStep(2);
      setResendTimer(60); // 60 second timer
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && idx < 5) {
      inputRefs.current[idx + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      // If current input is empty and we're not at the first input, move to previous
      if (!otp[idx] && idx > 0) {
        inputRefs.current[idx - 1].focus();
        newOtp[idx - 1] = ''; // Clear the previous input
        setOtp(newOtp);
      } else {
        // Clear current input
        newOtp[idx] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      // Focus the last input
      inputRefs.current[5].focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const otpString = otp.join('');
      if (otpString.length !== 6) {
        setError('Please enter all 6 digits of the OTP');
        setIsLoading(false);
        return;
      }

      const response = await authService.verifyRegistrationOtp({
        email: formData.email,
        otp: otpString
      });

      // Store the token
      localStorage.setItem('token', response.data.token);

      // Show success message
      alert('Registration successful! Redirecting to login...');

      // Redirect to login
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await authService.resendOtp(formData.email);
      alert('New OTP sent successfully!');
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToRegister = () => {
    setStep(1);
    setError('');
    setOtp(['', '', '', '', '', '']);
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
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {step === 1 ? 'Create Account' : 'Verify Email'}
          </h1>
          <p className="text-slate-600">
            {step === 1 ? (
              <>
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                >
                  Sign in
                </Link>
              </>
            ) : (
              'Enter the verification code sent to your email'
            )}
          </p>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
          {/* Step 1: Registration Form */}
          {step === 1 && (
            <form onSubmit={handleRegister} className="space-y-6">
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
                    placeholder="Choose a username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="block w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all bg-white/70"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
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
                    placeholder="Create a password"
                    minLength="6"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <FaArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={goBackToRegister}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                <FaArrowLeft className="h-4 w-4" />
                <span>Back to registration</span>
              </button>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3 animate-shake">
                  <FaExclamationCircle className="text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Email Info */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <FaEnvelope className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Check Your Email</h3>
                <p className="text-slate-600">
                  We sent a 6-digit code to
                </p>
                <p className="font-semibold text-emerald-600">{formData.email}</p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                {/* OTP Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 text-center">
                    Verification Code
                  </label>
                  <div className="flex justify-center space-x-2">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <input
                        key={idx}
                        required
                        maxLength="1"
                        type="text"
                        value={otp[idx]}
                        onChange={e => handleOtpChange(e, idx)}
                        onKeyDown={e => handleOtpKeyDown(e, idx)}
                        onPaste={handleOtpPaste}
                        ref={el => inputRefs.current[idx] = el}
                        autoFocus={idx === 0}
                        className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all bg-white/70"
                      />
                    ))}
                  </div>
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={isLoading || otp.join('').length !== 6}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="h-5 w-5" />
                      <span>Verify Code</span>
                    </>
                  )}
                </button>

                {/* Resend Code */}
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-2">
                    Didn't receive the code?
                  </p>
                  {resendTimer > 0 ? (
                    <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
                      <FaClock className="h-4 w-4" />
                      <span>Resend in {resendTimer}s</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="inline-flex items-center space-x-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors disabled:opacity-50"
                    >
                      <FaRedo className="h-4 w-4" />
                      <span>Resend Code</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Terms and Privacy (only show on step 1) */}
        {step === 1 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 leading-relaxed">
              By creating an account, you agree to our{' '}
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
        )}

        {/* Features Highlight (only show on step 1) */}
        {step === 1 && (
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
        )}
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

export default Register;