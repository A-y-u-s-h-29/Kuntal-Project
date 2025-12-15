import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-agro-dark-green text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <span className="text-agro-yellow">KUNTAL</span> AGRO
            </h3>
            <p className="text-gray-300 mb-4">
              Your trusted partner for quality agro products. We provide the best agricultural 
              products to farmers and businesses across the region.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-agro-yellow transition"><FaFacebook size={20} /></a>
              <a href="#" className="hover:text-agro-yellow transition"><FaTwitter size={20} /></a>
              <a href="#" className="hover:text-agro-yellow transition"><FaInstagram size={20} /></a>
              <a href="#" className="hover:text-agro-yellow transition"><FaLinkedin size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-agro-yellow transition">Home</a></li>
              <li><a href="/products" className="text-gray-300 hover:text-agro-yellow transition">Products</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-agro-yellow transition">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-agro-yellow transition">Contact</a></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Our Products</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-agro-yellow transition">Seeds</a></li>
              <li><a href="#" className="text-gray-300 hover:text-agro-yellow transition">Fertilizers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-agro-yellow transition">Pesticides</a></li>
              <li><a href="#" className="text-gray-300 hover:text-agro-yellow transition">Farm Equipment</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-agro-yellow" />
                <span className="text-gray-300">123 Farm Street, Agro City, State 12345</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-agro-yellow" />
                <span className="text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-agro-yellow" />
                <span className="text-gray-300">info@kuntalagro.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} KUNTAL AGRO AGENCIES. All rights reserved.</p>
          <p className="mt-2 text-sm">Quality Agro Products for Sustainable Farming</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;