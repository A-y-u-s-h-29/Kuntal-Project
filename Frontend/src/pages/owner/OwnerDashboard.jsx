import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';
import {
  FaPlus, FaEdit, FaTrash, FaChartBar, FaBox, FaDollarSign,
  FaUsers, FaShoppingCart, FaSeedling, FaTractor, FaLeaf
} from 'react-icons/fa';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    if (user?.role !== 'owner') {
      navigate('/');
      return;
    }
    fetchOwnerProducts();
  }, [user]);

  const fetchOwnerProducts = async () => {
    try {
      const response = await productAPI.getOwnerProducts();
      setProducts(response.data.products);
      
      // Calculate stats (in a real app, this would come from API)
      setStats({
        totalProducts: response.data.count,
        totalRevenue: products.reduce((sum, product) => sum + (product.price * 10), 0), // Mock data
        totalOrders: 45, // Mock data
        totalCustomers: 120, // Mock data
      });
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productAPI.deleteProduct(productId);
      setProducts(products.filter(product => product._id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'seeds': return <FaSeedling />;
      case 'equipment': return <FaTractor />;
      default: return <FaLeaf />;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-farm-gradient text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Owner Dashboard</h1>
              <p className="text-gray-100 mt-2">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={() => navigate('/owner/add-product')}
              className="bg-white text-agro-green px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Products</p>
                <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaBox className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaDollarSign className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Orders</p>
                <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaShoppingCart className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Customers</p>
                <p className="text-3xl font-bold mt-2">{stats.totalCustomers}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <FaUsers className="text-orange-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Your Products</h2>
            <p className="text-gray-600 text-sm mt-1">Manage your product inventory</p>
          </div>

          {products.length === 0 ? (
            <div className="p-12 text-center">
              <FaBox className="text-gray-300 text-6xl mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4">No products yet</h3>
              <p className="text-gray-600 mb-6">Start by adding your first product</p>
              <button
                onClick={() => navigate('/owner/add-product')}
                className="bg-agro-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-agro-dark-green transition"
              >
                Add First Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={product.image.url}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm">
                          <span className="mr-2">{getCategoryIcon(product.category)}</span>
                          {product.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-agro-green">
                        ₹{product.price}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => navigate(`/owner/edit-product/${product._id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-4 pb-12">
        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/owner/add-product')}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-left"
          >
            <div className="text-agro-green text-2xl mb-4">+</div>
            <h3 className="font-semibold mb-2">Add New Product</h3>
            <p className="text-gray-600 text-sm">Add a new product to your catalog</p>
          </button>
          <button
            onClick={() => navigate('/products')}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-left"
          >
            <div className="text-agro-green text-2xl mb-4">📊</div>
            <h3 className="font-semibold mb-2">View Catalog</h3>
            <p className="text-gray-600 text-sm">See how your products appear to customers</p>
          </button>
          <button
            onClick={() => navigate('/owner/analytics')}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-left"
          >
            <div className="text-agro-green text-2xl mb-4">
              <FaChartBar />
            </div>
            <h3 className="font-semibold mb-2">View Analytics</h3>
            <p className="text-gray-600 text-sm">Check sales and performance metrics</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;