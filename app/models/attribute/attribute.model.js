const mongoose = require("mongoose");

const Attribute = mongoose.model(
    "Attribute",
    new mongoose.Schema({
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        attribute: {
            type: String,
            required: true
        },

        dataTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DataType",
            required: true
        },
        deleted: {
            type: Boolean,
            default: false
        }
    })
);

module.exports = Attribute;
