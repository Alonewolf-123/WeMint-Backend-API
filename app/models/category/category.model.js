const mongoose = require("mongoose");

const Category = mongoose.model(
  "Category",
  new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    deleted: {
      type: Boolean,
      default: false
    }
  })
);

module.exports = Category;
