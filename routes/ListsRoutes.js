const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const crypto = require("crypto");
const List = require("../models/ListsModel");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware for validating list input
const validateListInput = (req, res, next) => {
  const { name, description, author, userId } = req.body;
  if (!name || !description || !author || !userId) {
    alert(userId+" "+author);
    return res.status(400).json({ message: "Name, description, author, and userId are required." });
  }
  next();
};

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

  if (!url) {
    return res.status(400).json({ message: "Problem link is required." });
  }

  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: "List not found." });
    }

    const newProblem = { _id: crypto.randomUUID(), url };
    list.problemLinks.push(newProblem);
    const updatedList = await list.save();
    res.json(updatedList);
  } catch (error) {
    console.error("Error adding problem link:", error);
    res.status(500).json({ message: "Error adding problem link: " + error.message });
  }
});

// DELETE: Remove a problem link from a list
router.delete("/lists/:listId/delete-problem/:problemId", async (req, res) => {
  try {
    const list = await List.findById(req.params.listId);
    if (!list) {
      return res.status(404).json({ message: "List not found." });
    }

    list.problemLinks = list.problemLinks.filter(problem => problem._id !== req.params.problemId);
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
    const updatedList = await List.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });
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
