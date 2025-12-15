const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id })
    .populate('items.product', 'name price image category');

  if (!cart) {
    return res.json({
      success: true,
      cart: { items: [], totalItems: 0, totalPrice: 0 }
    });
  }

  res.json({ success: true, cart });
};

exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
  }

  const index = cart.items.findIndex(
    i => i.product.toString() === productId
  );

  if (index > -1) {
    cart.items[index].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price
    });
  }

  await cart.save();

  const populatedCart = await Cart.findOne({ user: req.user.id })
    .populate('items.product', 'name price image category');

  res.json({
    success: true,
    cart: populatedCart
  });
};

exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });
  const item = cart.items.id(itemId);
  item.quantity = quantity;

  await cart.save();

  const populatedCart = await Cart.findOne({ user: req.user.id })
    .populate('items.product', 'name price image category');

  res.json({ success: true, cart: populatedCart });
};

exports.removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
  await cart.save();

  const populatedCart = await Cart.findOne({ user: req.user.id })
    .populate('items.product', 'name price image category');

  res.json({ success: true, cart: populatedCart });
};

exports.clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  cart.items = [];
  await cart.save();

  res.json({ success: true, cart });
};
