const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const superAdminPinSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    pin: {
      type: String,
      required: true,
      select: false, // 🔐 never auto fetch
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash PIN
superAdminPinSchema.pre('save', async function (next) {
  if (!this.isModified('pin')) return next();
  const salt = await bcrypt.genSalt(10);
  this.pin = await bcrypt.hash(this.pin, salt);
  next();
});

superAdminPinSchema.methods.matchPin = function (enteredPin) {
  return bcrypt.compare(enteredPin, this.pin);
};

module.exports = mongoose.model('SuperAdminPin', superAdminPinSchema);