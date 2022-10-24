const utils = require("../utils/utils");
const db = require("../models");
const Attribute = db.attribute;
const Category = db.category;
const DataType = db.dataType;


checkAttributeExist = (req, res, next) => {
    // attributeId
    Attribute.findOne({
        _id: req.body.id
    }).exec((err, attribute) => {
        if (err) {
            res.status(404).send({ result: 0, message: "Attribute Not found!" });
            return;
        }

        if (attribute) {
            if (attribute.deleted) {
                res.status(400).send({
                    result: 0,
                    message: `Attribute was deleted already!`
                });
                return;
            }
            next();
            return;
        }
        res.status(404).send({ result: 0, message: "Attribute Not found!" });
    });
};

checkValidParams = (req, res, next) => {

    const categoryId = req.body.categoryId;
    const attribute = req.body.attribute;
    const dataTypeId = req.body.dataTypeId;

    let invalidMessage = "";

    // categoryId
    Category.findOne({
        _id: categoryId
    }).exec((err, cateogry) => {
        if (err || !cateogry) {
            invalidMessage = "Category Id is not valid!";
        }

        if (utils.isEmpty(attribute)) {
            invalidMessage += utils.isEmpty(invalidMessage) ? "Attribute is not valid!" : "\n" + "Attribute is not valid!";
        }

        // dataTypeId
        DataType.findOne({
            _id: dataTypeId
        }).exec((err, dataType) => {

            if (err || !dataType) {
                invalidMessage += utils.isEmpty(invalidMessage) ? "DataType Id is not valid!" : "\n" + "DataType Id is not valid!";
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
