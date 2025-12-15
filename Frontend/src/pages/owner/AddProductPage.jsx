import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FaUpload, FaImage, FaDollarSign, FaBox, FaSeedling, FaTractor, FaLeaf } from 'react-icons/fa';

const AddProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', // Changed from 'title' to 'name'
    description: '',
    price: '',
    category: 'seeds',
    stock: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'seeds', label: 'Seeds', icon: <FaSeedling /> },
    { value: 'fertilizers', label: 'Fertilizers', icon: <FaLeaf /> },
    { value: 'pesticides', label: 'Pesticides', icon: <FaLeaf /> },
    { value: 'equipment', label: 'Equipment', icon: <FaTractor /> },
    { value: 'others', label: 'Others', icon: <FaBox /> },
  ];

  React.useEffect(() => {
    if (user?.role !== 'owner') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      toast.error('Please upload a product image');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name); // Changed from 'title' to 'name'
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('image', image);

      // Debug: Log what's being sent
      console.log('Form data being sent:', {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        stock: formData.stock,
        imageName: image?.name
      });

      await productAPI.createProduct(formDataToSend);
      
      toast.success('Product added successfully!');
      navigate('/owner/dashboard');
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || error.response?.data?.details || 'Failed to add product. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-agro-dark-green">
            Add New Product
          </h1>
          <p className="text-gray-600 mt-2">
            Fill in the details to add a new product to your catalog
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                {/* Product Name */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name" // Changed from 'title' to 'name'
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-agro-green"
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows="5"
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-agro-green"
                  />
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <label
                        key={category.value}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                          formData.category === category.value
                            ? 'border-agro-green bg-agro-green bg-opacity-5'
                            : 'border-gray-300 hover:border-agro-green'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={formData.category === category.value}
                          onChange={handleInputChange}
                          className="hidden"
                        />
                        <div className="text-agro-green mr-3">
                          {category.icon}
                        </div>
                        <span>{category.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Price */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                      className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-agro-green"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <div className="relative">
                    <FaBox className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="Enter stock quantity"
                      min="0"
                      required
                      className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-agro-green"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Product Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-agro-green transition">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <div className="mx-auto max-w-xs">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null);
                            setImagePreview(null);
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FaImage className="text-gray-400 text-4xl mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          Drag & drop or click to upload
                        </p>
                        <p className="text-gray-500 text-sm mb-4">
                          Supports JPG, PNG, WEBP • Max 5MB
                        </p>
                        <label className="inline-block bg-gray-100 text-gray-700 px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                          <FaUpload className="inline mr-2" />
                          Choose Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Requirements */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-sm mb-2">Image Requirements:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• High-quality product image</li>
                    <li>• Square or landscape orientation preferred</li>
                    <li>• Clear background recommended</li>
                    <li>• Max file size: 5MB</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 mt-8 pt-8 border-t">
              <button
                type="button"
                onClick={() => navigate('/owner/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-agro-green text-black rounded-lg font-semibold hover:bg-agro-dark-green transition disabled:opacity-50"
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;