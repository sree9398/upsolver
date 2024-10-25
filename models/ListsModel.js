const mongoose = require("mongoose");

// Define the Problem Link Schema
const problemLinkSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
});

// Define the List Schema
const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        requires:true,
    },
    problemLinks: [problemLinkSchema], // Embeds an array of problem links
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Create List Model
const List = mongoose.model("List", listSchema);
module.exports = List;
