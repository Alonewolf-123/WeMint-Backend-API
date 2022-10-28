const mongoose = require("mongoose");

const AssetBank = mongoose.model(
    "AssetBank",
    new mongoose.Schema({
        asset: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        externalLink: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        attributeValues: Object,
        artist: {
            type: String,
            required: true
        },
        supply: {
            type: String,
            required: true
        },
        blockchain: {
            type: String,
            required: true
        },
        created_at: { type: Date, default: Date.now },
        deleted: {
            type: Boolean,
            default: false
        }
    })
);

module.exports = AssetBank;
