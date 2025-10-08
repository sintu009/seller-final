const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const registerUser = async (name, email, password, role) => {
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  if (user) {
    if (role !== 'admin' && user.kycStatus !== 'approved') {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        kycStatus: user.kycStatus,
        message: 'Registration successful. Your account is pending admin approval.'
      };
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      kycStatus: user.kycStatus,
      token: generateToken(user._id)
    };
  } else {
    throw new Error('Invalid user data');
  }
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  if (user.role !== 'admin' && user.kycStatus !== 'approved') {
    throw new Error('Your account is pending approval. Please wait for admin verification.');
  }

  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    throw new Error('Invalid email or password');
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    kycStatus: user.kycStatus,
    token: generateToken(user._id)
  };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  generateToken
};
