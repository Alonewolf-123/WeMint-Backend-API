const mongoose = require("mongoose");

const Attribute = mongoose.model(
    "Attribute",
    new mongoose.Schema({
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },

        attribute: String,

        dataTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        },
        deleted: {
            type: Boolean,
            default: false
        }
    })
);

module.exports = Attribute;
