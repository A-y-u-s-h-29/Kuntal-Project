import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaHome, FaStore, FaSeedling } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaSeedling className="text-agro-green text-2xl" />
            <span className="text-xl font-bold text-agro-green font-poppins">
              KUNTAL AGRO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-agro-green transition flex items-center space-x-1">
              <FaHome />
              <span>Home</span>
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-agro-green transition flex items-center space-x-1">
              <FaStore />
              <span>Products</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="text-gray-700 hover:text-agro-green transition flex items-center space-x-1">
                  <FaShoppingCart />
                  <span>Cart</span>
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-agro-green transition">
                    <FaUser />
                    <span>{user?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="py-1">
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                      {user?.role === 'owner' && (
                        <Link to="/owner/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Owner Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-agro-green transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-agro-green text-white px-4 py-2 rounded-lg hover:bg-agro-dark-green transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t mt-2 pt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-agro-green transition" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-agro-green transition" onClick={() => setIsMenuOpen(false)}>
                Products
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/cart" className="text-gray-700 hover:text-agro-green transition" onClick={() => setIsMenuOpen(false)}>
                    Cart
                  </Link>
                  <Link to="/dashboard" className="text-gray-700 hover:text-agro-green transition" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  {user?.role === 'owner' && (
                    <Link to="/owner/dashboard" className="text-gray-700 hover:text-agro-green transition" onClick={() => setIsMenuOpen(false)}>
                      Owner Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-red-600 hover:text-red-800 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-agro-green transition" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-agro-green text-white px-4 py-2 rounded-lg hover:bg-agro-dark-green transition text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;