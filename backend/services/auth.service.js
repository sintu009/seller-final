const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id }, secret, {
    expiresIn: '7d'
  });
};

const registerUser = async (userData) => {
  console.log('registerUser called with:', { ...userData, password: '[HIDDEN]' });
  
  const userExists = await User.findOne({ email: userData.email });
  console.log('User exists check:', userExists ? 'Yes' : 'No');

  if (userExists) {
    throw new Error('User already exists');
  }

  console.log('Creating new user in database...');
  const user = await User.create(userData);
  console.log('User created with ID:', user._id);
  console.log('User role:', user.role);
  console.log('User KYC status:', user.kycStatus);

  if (user) {
    // Always return token for successful registration
    const token = generateToken(user._id);
    console.log('Token generated for user:', user._id);
    
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      kycStatus: user.kycStatus,
      token: token,
      message: user.role === 'admin' ? 'Registration successful' : 'Registration successful. Your account is pending admin approval.'
    };
  } else {
    throw new Error('Invalid user data');
  }
};

const loginUser = async (email, password) => {
  console.log('Login attempt for:', email);
  const user = await User.findOne({ email }).select('+password');
  console.log('User found:', user ? 'Yes' : 'No');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  console.log('Checking password...');
  const isPasswordMatch = await user.matchPassword(password);
  console.log('Password match:', isPasswordMatch);

  if (!isPasswordMatch) {
    throw new Error('Invalid email or password');
  }

  // Check KYC status for non-admin users
  if (user.role !== 'admin' && user.kycStatus !== 'approved') {
    throw new Error('Your account is pending approval. Please wait for admin verification.');
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    kycStatus: user.kycStatus,
    plan: user.plan,
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
