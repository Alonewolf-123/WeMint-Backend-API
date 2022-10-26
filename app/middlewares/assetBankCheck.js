const utils = require("../utils/utils");
const db = require("../models");
const Attribute = db.attribute;
const Category = db.category;
const User = db.user;


checkAssetBankExist = (req, res, next) => {
    next();
};

checkValidParams = (req, res, next) => {
    next();
};

const assetBankCheck = {
    checkAssetBankExist,
    checkValidParams
};

module.exports = assetBankCheck;
