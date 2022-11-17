const mongoose = require("mongoose");

const DataType = mongoose.model(
  "DataType",
  new mongoose.Schema({
    type: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true,
      unique: true
    },
    value: {
      type: String,
      required: true
    },
    parameter: {
      type: String,
      required: true
    },
    deleted: {
      type: Boolean,
      default: false
    }
  })
);

module.exports = DataType;
