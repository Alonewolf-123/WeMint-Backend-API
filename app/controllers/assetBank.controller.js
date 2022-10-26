const db = require("../models");
const AssetBank = db.assetBank;


exports.allAssetBanks = (req, res) => {
    res.status(200).send({ result: 1 });
};

exports.delAssetBank = (req, res) => {
    res.status(200).send({ result: 1 });
};

exports.createAssetBank = (req, res) => {
    res.status(200).send({ result: 1 });
};