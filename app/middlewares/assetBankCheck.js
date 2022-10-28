const utils = require("../utils/utils");
const db = require("../models");
const AssetBank = require("../models/assetBank/assetBank.model");

checkAssetBankExist = (req, res, next) => {
    // AssetBank
    AssetBank.findOne({
        _id: req.body.id
    }).exec((err, assetBank) => {
        if (err) {
            res.status(404).send({ result: 0, message: "AssetBank Not found!" });
            return;
        }

        if (assetBank) {
            if (assetBank.deleted) {
                res.status(400).send({
                    result: 0,
                    message: `AssetBank was deleted already!`
                });
                return;
            }
            next();
            return;
        }
        res.status(404).send({ result: 0, message: "AssetBank Not found!" });
    });
};

const assetBankCheck = {
    checkAssetBankExist
};

module.exports = assetBankCheck;
