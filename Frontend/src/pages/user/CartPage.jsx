import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowRight } from 'react-icons/fa';

const CartPage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

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

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    try {
      const response = await cartAPI.updateCartItem(itemId, { quantity: newQuantity });
      setCart(response.data.cart);
      toast.success('Cart updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await cartAPI.removeFromCart(itemId);
      setCart(response.data.cart);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    
    try {
      const response = await cartAPI.clearCart();
      setCart(response.data.cart);
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  if (loading) return <LoadingSpinner />;

  const cartItems = cart?.items || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-agro-dark-green flex items-center">
            <FaShoppingCart className="mr-3" />
            Your Shopping Cart
          </h1>
          <p className="text-gray-600 mt-2">
            Review and manage your cart items
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <FaShoppingCart className="text-gray-300 text-6xl mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-block bg-agro-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-agro-dark-green transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      {cartItems.length} Items in Cart
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item._id} className="p-6">
                      <div className="flex">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={item.product?.image?.url}
                            alt={item.product?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="ml-6 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">
                                {item.product?.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-3">
                                {item.product?.category}
                              </p>
                              <p className="text-agro-green text-xl font-bold">
                                ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                              </p>
                            </div>

                            <button
                              onClick={() => removeItem(item._id)}
                              className="text-red-500 hover:text-red-700 h-fit"
                              disabled={updating}
                            >
                              <FaTrash />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="px-3 py-1 hover:bg-gray-100"
                                disabled={updating || item.quantity <= 1}
                              >
                                <FaMinus />
                              </button>
                              <span className="px-4 py-1">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="px-3 py-1 hover:bg-gray-100"
                                disabled={updating}
                              >
                                <FaPlus />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{cart?.totalPrice || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">
                      {cart?.totalPrice >= 5000 ? 'FREE' : '₹100'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18%)</span>
                    <span className="font-semibold">
                      ₹{((cart?.totalPrice || 0) * 0.18).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-agro-green text-xl">
                        ₹{((cart?.totalPrice || 0) + (cart?.totalPrice >= 5000 ? 0 : 100)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link
                    to="/checkout"
                    className="block w-full bg-agro-green text-white py-3 rounded-lg font-semibold text-center hover:bg-agro-dark-green transition flex items-center justify-center"
                  >
                    Proceed to Checkout
                    <FaArrowRight className="ml-2" />
                  </Link>
                  <Link
                    to="/products"
                    className="block w-full border-2 border-agro-green text-agro-green py-3 rounded-lg font-semibold text-center hover:bg-agro-green hover:text-white transition"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* User Info */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Delivery Address</h3>
                  <p className="text-sm text-gray-600">
                    {user?.address || 'No address provided'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Phone: {user?.phone}
                  </p>
                  <Link
                    to="/dashboard/profile"
                    className="text-agro-green text-sm hover:underline mt-2 inline-block"
                  >
                    Update address
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;