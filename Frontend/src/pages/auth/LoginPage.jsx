import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isOwnerLogin, setIsOwnerLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, ownerLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = isOwnerLogin 
        ? await ownerLogin(formData)
        : await login(formData);

      if (result.success) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.role === 'owner') {
          navigate('/owner/dashboard');
        } else {
          navigate(user?.isProfileComplete ? '/' : '/dashboard/profile');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-agro-green rounded-full mb-4">
            <FaUser className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-agro-dark-green">
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-2">
            {isOwnerLogin ? 'Owner Login' : 'Sign in to your account'}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Toggle Button */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsOwnerLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md transition ${
                !isOwnerLogin
                  ? 'bg-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              User Login
            </button>
            <button
              onClick={() => setIsOwnerLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md transition ${
                isOwnerLogin
                  ? 'bg-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Owner Login
            </button>
          </div>

          {isOwnerLogin && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">
                <strong>Note:</strong> Owner login uses credentials from .env file.
                Contact administrator if you don't have access.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-agro-green"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-agro-green"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-agro-green text-white py-3 rounded-lg font-semibold hover:bg-agro-dark-green transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t"></div>
            <div className="px-4 text-gray-500">or</div>
            <div className="flex-1 border-t"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-agro-green hover:underline font-semibold">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials (for development) */}
        {import.meta.env.NODE_ENV === 'development' && !isOwnerLogin && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Demo User Credentials:</p>
            <p className="text-sm">Email: user@example.com</p>
            <p className="text-sm">Password: password123</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
