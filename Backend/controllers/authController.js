const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

// Register
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  let { name, email, password, phone, address } = req.body;
  email = email.toLowerCase().trim();

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    address,
    isProfileComplete: true
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      isProfileComplete: user.isProfileComplete
    }
  });
};

// Login
exports.login = async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase().trim();

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      isProfileComplete: user.isProfileComplete
    }
  });
};

// Owner login
exports.ownerLogin = async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase().trim();

  if (
    email !== process.env.OWNER_EMAIL.toLowerCase() ||
    password !== process.env.OWNER_PASSWORD
  ) {
    return res.status(401).json({ success: false, message: 'Invalid owner credentials' });
  }

  let owner = await User.findOne({ email });
  if (!owner) {
    owner = await User.create({
      name: 'Owner',
      email,
      password: process.env.OWNER_PASSWORD,
      phone: '0000000000',
      address: 'Owner Address',
      role: 'owner',
      isProfileComplete: true
    });
  }

  const token = generateToken(owner._id);

  res.json({
    success: true,
    token,
    user: {
      id: owner._id,
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      address: owner.address,
      role: owner.role,
      isProfileComplete: owner.isProfileComplete
    }
  });
};

// Get me
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, user });
};
