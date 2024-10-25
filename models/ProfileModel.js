// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  location: { type: String },
  description: { type: String },
  listCount: { type: Number },
  upsolveListCount: { type: Number },
  followers: { type: Number },
  friends: { type: Number },
  upvotes: { type: Number },
  publicLists: { type: Number },
  publicBlogs: [String],
  twitter: { type: String },
  imageUrl: { type: String }, // New field for profile image URL
  github: { type: String }, // New field for GitHub profile link
  leetcode: { type: String }, // New field for LeetCode profile link
  codeforces: { type: String }, // New field for Codeforces profile link
  codechef: { type: String }, // New field for CodeChef profile link
  linkedin: { type: String }, // New field for LinkedIn profile link
  atcoder: { type: String }, // New field for AtCoder profile link
  geeksforgeeks: { type: String }, // New field for GeeksforGeeks profile link
  code360: { type: String }, // New field for Code360 profile link
});

const User = mongoose.model("Profile", userSchema);

module.exports = User;
