import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaSearch, FaFilter, FaSeedling, FaTractor, FaLeaf, FaShoppingCart } from 'react-icons/fa';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { id: 'all', name: 'All Products', icon: <FaSeedling /> },
    { id: 'seeds', name: 'Seeds', icon: <FaSeedling /> },
    { id: 'fertilizers', name: 'Fertilizers', icon: <FaLeaf /> },
    { id: 'pesticides', name: 'Pesticides', icon: <FaLeaf /> },
    { id: 'equipment', name: 'Equipment', icon: <FaTractor /> },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, sortBy, products]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getProducts();
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-agro-dark-green mb-4">
            Our Products
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Discover our wide range of agricultural products. Quality guaranteed for better yield.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-agro-green"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-agro-green appearance-none"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-agro-green"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-3 mt-6">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full transition ${
                  selectedCategory === category.id
                    ? 'bg-agro-green text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <FaSearch className="text-gray-300 text-6xl mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">No products found</h2>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                <div className="relative">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={product.image.url}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                  {product.stock === 0 && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-sm">
                      Out of Stock
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {product.category}
                      </span>
                      <h3 className="font-semibold text-lg mt-2 truncate">{product.title}</h3>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-agro-green">₹{product.price}</span>
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/product/${product._id}`}
                      className="flex-1 bg-agro-green text-white py-2 rounded-lg font-semibold text-center hover:bg-agro-dark-green transition"
                    >
                      View Details
                    </Link>
                    <button
                      className={`flex items-center justify-center px-4 py-2 rounded-lg transition ${
                        product.stock > 0
                          ? 'bg-agro-yellow text-agro-dark-green hover:bg-yellow-500'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={product.stock === 0}
                      title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
                    >
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination would go here */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">Previous</button>
              <button className="px-4 py-2 bg-agro-green text-white rounded-lg">1</button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">2</button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">3</button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;