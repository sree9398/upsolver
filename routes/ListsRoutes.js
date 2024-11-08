const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const crypto = require("crypto");
const mongoose = require("mongoose");
const List = require("../models/ListsModel");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// GET: Fetch all lists
router.get("/lists", async (req, res) => {
  try {
    const lists = await List.find();
    res.json(lists);
  } catch (error) {
    console.error("Error fetching lists:", error);
    res.status(500).send("Error fetching lists: " + error.message);
  }
});

// POST: Create a new list
router.post("/lists", async (req, res) => {
  const { name, description, author, userId } = req.body;

  // Validate input fields
  if (!name || !description || !author || !userId) {
    return res.status(400).json({ message: "Name, description, author, and userId are required." });
  }

  try {
    const newList = new List({
      name,
      description,
      author,
      userId,
    });

    const savedList = await newList.save();
    res.status(201).json(savedList);
  } catch (error) {
    console.error("Error creating new list:", error);
    res.status(500).json({ message: "Error creating new list: " + error.message });
  }
});

// PUT: Add a problem link to a list
router.put("/lists/:id/add-problem", async (req, res) => {
  const { url } = req.body;

  // Validate URL
  if (!url) {
    return res.status(400).json({ message: "Problem link is required." });
  }

  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!urlPattern.test(url)) {
    return res.status(400).json({ message: "Invalid URL format." });
  }

  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: "List not found." });
    }

    const newProblem = { _id: new mongoose.Types.ObjectId(), url };
    list.problemLinks.push(newProblem);

    const updatedList = await list.save();
    res.json(updatedList);
  } catch (error) {
    console.error("Error adding problem link:", error);
    res.status(500).json({ message: "Error adding problem link: " + error.message });
  }
});

// DELETE: Remove a list
router.delete("/lists/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.headers["user-id"]; // Assuming you are sending userId in headers

  try {
    const list = await List.findById(id);
    if (!list) {
      return res.status(404).json({ message: "List not found." });
    }

    // Check if the user has permission
    if (list.userId.toString() !== userId) { // Ensure you are comparing the string representation
      return res.status(403).json({ message: "You do not have permission to delete this list." });
    }

    await List.findByIdAndDelete(id);
    return res.status(200).json({ message: "List deleted successfully." });
  } catch (error) {
    console.error("Error deleting list:", error);
    return res.status(500).json({ message: "Server error." });
  }
});


// DELETE: Remove a problem link from a list
router.delete("/lists/:listId/delete-problem/:problemId", async (req, res) => {
  try {
    const list = await List.findById(req.params.listId);
    if (!list) {
      return res.status(404).json({ message: "List not found." });
    }

    // Remove problem link by filtering out the one with the specified ID
    list.problemLinks = list.problemLinks.filter(
      (problem) => problem._id.toString() !== req.params.problemId
    );

    const updatedList = await list.save();
    res.json(updatedList);
  } catch (error) {
    console.error("Error deleting problem link:", error);
    res.status(500).json({ message: "Error deleting problem link: " + error.message });
  }
});

// PUT: Update a list's details (name, description)
router.put("/lists/:id", async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate input fields
    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required." });
    }

    const updatedList = await List.findOneAndUpdate(
      { _id: req.params.id },
      { name, description },
      { new: true, runValidators: true }
    );
    if (!updatedList) {
      return res.status(404).json({ message: "List not found." });
    }
    res.json(updatedList);
  } catch (err) {
    console.error("Error updating list:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
