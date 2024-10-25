const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const crypto = require("crypto");
const Blog=require("../models/BlogsModel");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Make sure to set this in your environment variables


//retrive the blogs from the server
router.get('/blogs', async (req, res) => {
    try {
      const blogs = await Blog.find();
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  
  //save the blogs into the server
  router.post('/blogs', async (req, res) => {
    const { title, content, author } = req.body;
    try {
      const newBlog = new Blog({ title, content, author });
      await newBlog.save();
      res.status(201).json(newBlog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  

module.exports = router;
