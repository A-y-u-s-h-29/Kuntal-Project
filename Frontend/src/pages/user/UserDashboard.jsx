import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cartAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaUser, FaShoppingCart, FaMapMarkerAlt, FaPhone, FaEdit, FaHistory } from 'react-icons/fa';

const UserDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-farm-gradient text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Dashboard</h1>
              <p className="text-gray-100 mt-2">
                Welcome back, {user?.name}!
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm">Account Status</p>
                <p className="text-lg font-semibold">
                  {user?.isProfileComplete ? 'Active' : 'Profile Incomplete'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaUser className="mr-3 text-agro-green" />
                  Personal Information
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-agro-green hover:text-agro-dark-green flex items-center"
                >
                  <FaEdit className="mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-agro-green"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleEditChange}
                        className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-agro-green"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Address</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <textarea
                        name="address"
                        value={editForm.address}
                        onChange={handleEditChange}
                        rows="3"
                        className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-agro-green"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-6 py-2 bg-agro-green text-white rounded-lg hover:bg-agro-dark-green"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600 text-sm">Full Name</p>
                      <p className="font-semibold mt-1">{user?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Email Address</p>
                      <p className="font-semibold mt-1">{user?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600 text-sm">Phone Number</p>
                      <p className="font-semibold mt-1 flex items-center">
                        <FaPhone className="mr-2 text-gray-400" />
                        {user?.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Account Type</p>
                      <p className="font-semibold mt-1 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Address</p>
                    <p className="font-semibold mt-1 flex items-start">
                      <FaMapMarkerAlt className="mr-2 text-gray-400 mt-1 flex-shrink-0" />
                      {user?.address}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FaHistory className="mr-3 text-agro-green" />
                Recent Orders
              </h2>
              <div className="text-center py-12">
                <FaHistory className="text-gray-300 text-6xl mx-auto mb-6" />
                <p className="text-gray-600">No orders yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Your order history will appear here
                </p>
                <Link
                  to="/products"
                  className="inline-block mt-6 bg-agro-green text-white px-6 py-2 rounded-lg hover:bg-agro-dark-green transition"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Stats */}
          <div>
            {/* Cart Summary */}
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FaShoppingCart className="mr-3 text-agro-green" />
                Cart Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items in Cart</span>
                  <span className="font-semibold">{cart?.totalItems || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cart Value</span>
                  <span className="font-semibold text-agro-green">
                    ₹{cart?.totalPrice || 0}
                  </span>
                </div>
              </div>
              <Link
                to="/cart"
                className="block w-full mt-6 bg-agro-green text-white py-3 rounded-lg text-center hover:bg-agro-dark-green transition"
              >
                View Cart
              </Link>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Quick Links</h2>
              <div className="space-y-4">
                <Link
                  to="/products"
                  className="block p-4 border rounded-lg hover:border-agro-green hover:bg-agro-green hover:bg-opacity-5 transition"
                >
                  <p className="font-semibold">Browse Products</p>
                  <p className="text-sm text-gray-600 mt-1">Shop our catalog</p>
                </Link>
                <Link
                  to="/cart"
                  className="block p-4 border rounded-lg hover:border-agro-green hover:bg-agro-green hover:bg-opacity-5 transition"
                >
                  <p className="font-semibold">My Cart</p>
                  <p className="text-sm text-gray-600 mt-1">Review your cart</p>
                </Link>
                <Link
                  to="/orders"
                  className="block p-4 border rounded-lg hover:border-agro-green hover:bg-agro-green hover:bg-opacity-5 transition"
                >
                  <p className="font-semibold">My Orders</p>
                  <p className="text-sm text-gray-600 mt-1">Track your orders</p>
                </Link>
              </div>
            </div>

            {/* Profile Completion */}
            {!user?.isProfileComplete && (
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Complete Your Profile
                </h3>
                <p className="text-yellow-700 text-sm mb-4">
                  Please complete your profile to enable cart functionality.
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  Complete Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;