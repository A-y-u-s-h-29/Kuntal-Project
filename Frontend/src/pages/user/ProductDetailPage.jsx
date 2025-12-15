import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { FaShoppingCart, FaStar, FaTruck, FaShieldAlt, FaLeaf } from 'react-icons/fa';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getProduct(id);
      setProduct(response.data.product);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!user?.isProfileComplete) {
      toast.error('Please complete your profile first');
      navigate('/dashboard/profile');
      return;
    }

    try {
      await cartAPI.addToCart({ productId: id, quantity });
      toast.success('Product added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="p-8">
              <div className="rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={product.image.url}
                  alt={product.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="p-8">
              <div className="mb-6">
                <span className="bg-agro-green text-white px-3 py-1 rounded-full text-sm">
                  {product.category}
                </span>
                <h1 className="text-3xl font-bold mt-4 mb-2">{product.title}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <span className="text-gray-600">({product.numReviews} reviews)</span>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <FaLeaf className="text-agro-green mr-3" />
                  <span>Organic Certified</span>
                </div>
                <div className="flex items-center">
                  <FaTruck className="text-agro-green mr-3" />
                  <span>Free Delivery on orders above ₹5000</span>
                </div>
                <div className="flex items-center">
                  <FaShieldAlt className="text-agro-green mr-3" />
                  <span>Quality Guaranteed</span>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="text-4xl font-bold text-agro-green">₹{product.price}</span>
                  <span className="ml-4 text-gray-500">
                    Stock: {product.stock} units
                  </span>
                </div>

                <div className="flex items-center mb-6">
                  <span className="mr-4">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-2">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-agro-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-agro-dark-green transition flex items-center justify-center"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-agro-yellow text-agro-dark-green py-3 px-6 rounded-lg font-semibold hover:bg-yellow-500 transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Product Specifications</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{product.category}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Availability</span>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Shipping Info</h3>
            <p className="text-gray-600 mb-2">Delivery within 3-5 business days</p>
            <p className="text-gray-600">Free shipping on orders above ₹5000</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Return Policy</h3>
            <p className="text-gray-600">30-day return policy for unopened items</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;