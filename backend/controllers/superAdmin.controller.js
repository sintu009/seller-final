const User = require('../models/user.model');
const SuperAdminPin = require('../models/superAdminPin.model');

const createSuperAdmin = async (req, res) => {
  try {
    const { name, email, password, pin,authkey } = req.body;

    // 🔴 Validations
    if (!name || !email || !password || !pin || !authkey) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, PIN and authkey are required',
      });
    }

    if(authkey !== process.env.SUPER_ADMIN_AUTH_KEY){
        return res.status(400).json({
            success: false,
            message: 'Invalid authkey',
        });
    }

    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({
        success: false,
        message: 'PIN must be exactly 4 digits',
      });
    }

    // 🔴 Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // 🟢 Create User
    const user = await User.create({
      name,
      email,
      password,
      role: 'superadmin',
      isActive: true,
      kycStatus: 'approved',
    });

    // 🟢 Create PIN record
    await SuperAdminPin.create({
      user: user._id,
      pin,
    });

    res.status(201).json({
      success: true,
      message: 'Super admin created successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Create super admin error:', error);

    // 🔥 Rollback if PIN creation fails
    if (error.code === 11000) {
      await User.deleteOne({ email: req.body.email });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifySuperAdmin = async (req, res) => {
  try {
    const { email, password, pin } = req.body;

    if (!email || !password || !pin) {
      return res.status(400).json({
        success: false,
        message: 'Email, password and pin are required',
      });
    }

    // 🔍 Find super admin
    const user = await User.findOne({
      email,
      role: 'superadmin',
      isDeleted: false,
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // 🔐 Verify password
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // 🔢 Verify PIN
    const pinRecord = await SuperAdminPin.findOne({ user: user._id }).select('+pin');

    if (!pinRecord) {
      return res.status(401).json({
        success: false,
        message: 'Super admin PIN not found',
      });
    }

    const isPinMatch = await pinRecord.matchPin(pin);
    if (!isPinMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid PIN',
      });
    }

    // 🎟 Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Super admin verified successfully',
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSuperAdmin,
  verifySuperAdmin,
};
