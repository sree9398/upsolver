// routes/auth.js
const express = require("express");
const Profile = require("../models/ProfileModel");
const User = require("../models/UserModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const crypto = require("crypto");
const transporter = require("../config/nodemailer");


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Make sure to set this in your environment variables

// Register Route
router.post('/register', async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User Email already exists" });

    let user1 = await User.findOne({ username });
    if (user1) return res.status(400).json({ message: "Username already exists" });

    user = new User({ username, name, email, password });
    profile=new Profile({username:username,name:name,email:email});
    await profile.save();
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    // console.log("username in login route :",user.username);
    res.json({
      token,
      username: user.username, // Include username in the response
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Request OTP
router.post('/request-otp', async (req, res) => {
  const { email } = req.body;

  try {
    const otp = crypto.randomInt(100000, 999999).toString();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Store OTP in the database (with expiration time)
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to send OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(user.otp,' ',otp);
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    

    user.password = newPassword; // Make sure to hash the new password
    user.otp = undefined; // Clear OTP
    user.otpExpires = undefined; // Clear OTP expiration
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Protected route example
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Accessed protected route!" });
});





//username profile data fetch
router.get('/profile/:username', async (req, res) => {
  const { username } = req.params;
  // console.log(username);
  try {
    const user = await Profile.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//update the profile data
router.put('/profile/:username', async (req, res) => {
  const { username } = req.params;
  const updatedData = req.body;

  try {
    const user = await Profile.findOneAndUpdate({ username }, updatedData, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});













module.exports = router;

