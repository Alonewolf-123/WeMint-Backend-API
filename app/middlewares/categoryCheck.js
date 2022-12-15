const utils = require("../utils/utils");
const db = require("../models");
const Attribute = require("../models/attribute/attribute.model");
const AssetBank = require("../models/assetBank/assetBank.model");
const Category = db.category;


checkCategoryExist = (req, res, next) => {
    // category
    Category.findOne({
        _id: req.body.id
    }).exec((err, category) => {
        if (err || category == null || category == undefined || category.length == 0) {
            res.status(404).send({ result: 0, message: "Category Not found!" });
            return;
        }

        if (category) {
            next();
            return;
        }
        res.status(404).send({ result: 0, message: "Category Not found!" });
    });
};

checkCategoryCanDelete = (req, res, next) => {
    console.log(req);
    const category = req.body.id;
    const query = { category: category, deleted: false };
    Attribute.find(query).then((attributes) => {
        console.log(attributes);
        if (attributes && attributes.length > 0) {
            res.status(400).send({ result: 0, message: "This category can't be deleted" });
        } else {
            AssetBank.find(query).then((assetBanks) => {
                if (assetBanks && assetBanks.length > 0) {
                    res.status(400).send({ result: 0, message: "This category can't be deleted" });
                } else {
                    next();
                }
            }).catch((err) => {
                next();
            });
        }
    }).catch((err) => {

        AssetBank.find(query).then((assetBanks) => {
            if (assetBanks && assetBanks.length > 0) {
                res.status(400).send({ result: 0, message: "This category can't be deleted" });
            } else {
                next();
            }
        }).catch((err) => {
            next();
        });
    });
};

const categoryCheck = {
    checkCategoryExist,
    checkCategoryCanDelete
};

module.exports = categoryCheck;
