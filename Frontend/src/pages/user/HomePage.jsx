import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaSeedling, FaTractor, FaLeaf, FaShoppingCart, FaStar } from 'react-icons/fa';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getProducts();
      setProducts(response.data.products);
      // Get first 4 products as featured
      setFeaturedProducts(response.data.products.slice(0, 4));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaSeedling className="text-4xl" />,
      title: 'Quality Seeds',
      description: 'Premium quality seeds for maximum yield'
    },
    {
      icon: <FaTractor className="text-4xl" />,
      title: 'Farm Equipment',
      description: 'Modern farming equipment and tools'
    },
    {
      icon: <FaLeaf className="text-4xl" />,
      title: 'Organic Products',
      description: '100% organic fertilizers and pesticides'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-farm-gradient text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-poppins">
              Grow Better with <span className="text-agro-yellow">KUNTAL AGRO</span>
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Your trusted partner for quality agricultural products. 
              We provide everything you need for successful farming.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="bg-agro-yellow text-agro-dark-green px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
              >
                Browse Products
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-agro-dark-green transition"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-agro-dark-green">
            Why Choose KUNTAL AGRO?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-lg transition">
                <div className="text-agro-green mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-agro-dark-green">
              Featured Products
            </h2>
            <Link
              to="/products"
              className="text-agro-green hover:text-agro-dark-green font-semibold"
            >
              View All Products →
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={product.image.url}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2 truncate">{product.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-agro-green">₹{product.price}</span>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-gray-600">{product.rating || '4.5'}</span>
                      </div>
                    </div>
                    <Link
                      to={`/product/${product._id}`}
                      className="w-full bg-agro-green text-white py-2 rounded-lg flex items-center justify-center hover:bg-agro-dark-green transition"
                    >
                      <FaShoppingCart className="mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-agro-green text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Grow Your Farm?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied farmers who trust KUNTAL AGRO for their agricultural needs.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-agro-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;