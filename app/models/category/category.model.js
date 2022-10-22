const mongoose = require("mongoose");

const Category = mongoose.model(
  "Category",
  new mongoose.Schema({
    name: String,
    description: String,
    deleted: {
      type: Boolean,
      default: false
    }
  })
);

module.exports = Category;
