const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const crypto = require("crypto");
const Stream=require('../models/StreamsModel');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Make sure to set this in your environment variables



// Route to add a new stream
router.post("/streams", async (req, res) => {
    try {
      const { author, topic, description, youtubeLink } = req.body;
  
      // Create a new stream
      const newStream = new Stream({ author, topic, description, youtubeLink });
  
      // Save to the database
      const savedStream = await newStream.save();
      res.status(201).json(savedStream);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  
  //Route to fetch streams
  router.get("/streams", async (req, res) => {
    try {
      const streams = await Stream.find();
      res.status(200).json(streams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  //Route to Delete stream
  router.delete("/streams/:id", async (req, res) => {
    try {
      // Find the stream by ID and delete it
      const stream = await Stream.findByIdAndDelete(req.params.id);
  
      // Check if the stream exists
      if (!stream) {
        return res.status(404).json({ message: "Stream not found" });
      }
  
      // Return a success message after deletion
      res.json({ message: "Stream deleted successfully" });
    } catch (error) {
      // Handle any server errors
      res.status(500).json({ message: "Server error while deleting stream" });
    }
  });
  
  
  //Route to update Stream
  router.put("/streams/:id", async (req, res) => {
    const { id } =req.params.id;
    const { author, topic, description, youtubeLink } = req.body;
  
    try {
      // Find the stream by ID
      const stream = await Stream.findById(req.params.id);
  
      // Check if stream exists
      if (!stream) {
        return res.status(404).json({ message: "Stream not found" });
      }
  
      // Check if the logged-in user is the author (authorization check)
      if (stream.author !== author) {
        return res.status(403).json({ message: "You are not authorized to update this stream" });
      }
  
      // Update stream details
      stream.topic = topic || stream.topic;
      stream.description = description || stream.description;
      stream.youtubeLink = youtubeLink || stream.youtubeLink;
  
      // Save the updated stream to the database
      const updatedStream = await stream.save();
      res.status(200).json(updatedStream);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating the stream" });
    }
  });
  

  
  module.exports = router;