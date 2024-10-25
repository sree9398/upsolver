const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Import crypto for OTP generation

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true }, // Unique index
  email: { type: String, required: true, unique: true }, // Unique index
  password: { type: String, required: true },
  otp: { type: String }, // Field to store OTP
  otpExpires: { type: Date }, // Field to store OTP expiration time
});

// Middleware to hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate OTP
UserSchema.methods.generateOTP = function() {
  // Generate a 6-digit OTP
  this.otp = crypto.randomInt(100000, 999999).toString();
  // OTP expires in 15 minutes
  this.otpExpires = Date.now() + 15 * 60 * 1000;
};

// Method to verify OTP
UserSchema.methods.verifyOTP = function(otp) {
  return this.otp === otp && this.otpExpires > Date.now();
};

// Create indexes
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
// Drop existing unique index on name (if it exists)
UserSchema.index('username');


const User = mongoose.model('User', UserSchema);
module.exports = User;
