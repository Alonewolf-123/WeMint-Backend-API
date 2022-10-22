const mongoose = require("mongoose");

const DataType = mongoose.model(
  "DataType",
  new mongoose.Schema({
    type: String,
    label: String,
    value: String,
    deleted: {
      type: Boolean,
      default: false
    }
  })
);

module.exports = DataType;
