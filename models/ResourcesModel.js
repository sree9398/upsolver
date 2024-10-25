const mongoose = require('mongoose');

// Define the Resource schema
const resourceSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  addedBy: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});


const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
