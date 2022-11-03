const utils = require("../utils/utils");
const db = require("../models");
const Attribute = db.attribute;
const Category = db.category;
const DataType = db.dataType;


checkAttributeExist = (req, res, next) => {
    // attribute
    Attribute.findOne({
        _id: req.body.id
    }).exec((err, attribute) => {
        if (err || attribute == null || attribute == undefined || attribute.length == 0) {
            res.status(404).send({ result: 0, message: "Attribute Not found!" });
            return;
        }

        if (attribute) {
            next();
            return;
        }
        res.status(404).send({ result: 0, message: "Attribute Not found!" });
    });
};

checkValidParams = (req, res, next) => {

    const category = req.body.category;
    const dataType = req.body.dataType;

    let invalidMessage = "";

    // category
    Category.findOne({
        _id: category
    }).exec((err, cateogry) => {
        if (err || !cateogry) {
            invalidMessage = "Category is not valid!";
        }

        // dataType
        DataType.findOne({
            _id: dataType
        }).exec((err, dataType) => {

            if (err || !dataType) {
                invalidMessage += utils.isEmpty(invalidMessage) ? "DataType is not valid!" : "\n" + "DataType is not valid!";
            }

            if (!utils.isEmpty(invalidMessage)) {
                res.status(400).send({ result: 0, message: invalidMessage });
                return;
            }
            next();
        });

    });
};

const attributeCheck = {
    checkAttributeExist,
    checkValidParams
};

module.exports = attributeCheck;
