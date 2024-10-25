const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const crypto = require("crypto");
const Resource = require("../models/ResourcesModel");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Make sure to set this in your environment variables

// GET all resources
router.get("/resources", async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new resource
router.post("/resources", async (req, res) => {
  const { category, name, link, addedBy } = req.body;

  if (!category || !name || !link || !addedBy) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newResource = new Resource({ category, name, link, addedBy });
    await newResource.save();
    res.status(201).json(newResource); // Respond with the saved resource
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Edit a resource
router.put("/resources/:id", async (req, res) => {
  const { id } = req.params;
  const { category, name, link, addedBy } = req.body;

  try {
    // Find the resource by ID
    const resource = await Resource.findById(id);

    // Check if the resource exists
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Check if the current user is the one who added the resource
    if (resource.addedBy !== addedBy) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this resource" });
    }

    // Update resource fields
    resource.category = category || resource.category;
    resource.name = name || resource.name;
    resource.link = link || resource.link;

    // Save the updated resource
    const updatedResource = await resource.save();
    res.status(200).json(updatedResource);
  } catch (error) {
    console.error("Error updating resource:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the resource" });
  }
});

// Delete a resource
router.delete("/resources/:id", async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting resource" });
  }
});

module.exports = router;
