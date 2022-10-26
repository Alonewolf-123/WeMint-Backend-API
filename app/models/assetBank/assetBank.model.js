const mongoose = require("mongoose");

const AssetBank = mongoose.model(
    "AssetBank",
    new mongoose.Schema({
        attributeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attribute"
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        asset: String,
        name: String,
        externalLink: String,
        description: String,
        artist: String,
        supply: String,
        blockchain: String,
        created_at: { type : Date, default: Date.now },
        deleted: {
            type: Boolean,
            default: false
        }
    })
);

module.exports = AssetBank;
