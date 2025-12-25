const authService = require('../services/auth.service');
const { createNotification } = require('../utils/notification.helper');
const User = require('../models/user.model');

const register = async (req, res) => {
  try {
    const { name, email, password, role, businessName, gstNumber, panNumber, phoneNumber, address } = req.body;
    
    console.log('Registration attempt:', { name, email, role });

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (!['admin', 'seller', 'supplier'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    const kycDocuments = {
      businessName,
      taxId: gstNumber,
      businessRegistration: panNumber
    };

    if (req.files) {
      if (req.files.gstCertificate && req.files.gstCertificate[0]) {
        kycDocuments.idProof = req.files.gstCertificate[0].path;
      }
      if (req.files.panCard && req.files.panCard[0]) {
        kycDocuments.addressProof = req.files.panCard[0].path;
      }
      if (req.files.cancelledCheque && req.files.cancelledCheque[0]) {
        kycDocuments.bankDetails = {
          cancelledChequePath: req.files.cancelledCheque[0].path
        };
      }
    }

    const userData = {
      name,
      email,
      password,
      role,
      phone: phoneNumber,
      address: address ? JSON.parse(address) : undefined,
      kycDocuments
    };

    console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });
    const user = await authService.registerUser(userData);
    console.log('User created successfully:', user._id);

    if (user.role === 'seller' && global.io) {
      global.io.emit('NEW_SELLER_REGISTERED', {
        id: user._id,
        name: user.name,
        email: user.email,
      });
    }

    if (role !== 'admin') {
      const admins = await User.find({
        role: 'admin',
        isDeleted: false,
      }).select('_id');

      await Promise.all(
        admins.map((admin) =>
          createNotification({
            user: admin._id,
            title: `New ${role} registered`,
            message: `${name} (${email}) has registered and requires approval.`,
            type: 'info',
            entityType: 'user',
            entityId: user._id,
          })
        )
      );
    }
    
    if (user.token) {
      res.cookie('token', user.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    }

    res.status(201).json({
      success: true,
      message: user.message || 'User registered successfully',
      token: user.token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        kycStatus: user.kycStatus,
        requiresApproval: user.kycStatus === 'pending'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await authService.loginUser(email, password);

    res.cookie('token', user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: user.token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        kycStatus: user.kycStatus,
        plan: user.plan
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0)
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile
};
