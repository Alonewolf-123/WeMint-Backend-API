const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      unique: true,
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      select: true
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    locked: {
      type: Boolean,
      default: false
    },
    deleted: {
      type: Boolean,
      default: false
    }
  })
);

module.exports = User;
