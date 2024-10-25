const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Stream schema
const streamSchema = new Schema({
  author: {
    type: String,
    required: true,   // Username of the stream creator
  },
  topic: {
    type: String,
    required: true,   // Topic of the stream
    trim: true,
  },
  description: {
    type: String,
    required: true,   // Short description of the stream
    trim: true,
  },
  youtubeLink: {
    type: String,
    required: true,   // YouTube stream URL
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Timestamp for stream creation
  },
});

// Create a Mongoose model for the schema
const Stream = mongoose.model("Stream", streamSchema);

module.exports = Stream;
