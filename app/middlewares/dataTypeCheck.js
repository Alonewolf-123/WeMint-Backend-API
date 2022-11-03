const utils = require("../utils/utils");
const db = require("../models");
const Attribute = require("../models/attribute/attribute.model");
const DataType = db.dataType;


checkDataTypeExist = (req, res, next) => {
    // dataType
    DataType.findOne({
        _id: req.body.id
    }).exec((err, dataType) => {
        if (err || dataType == null || dataType == undefined || dataType.length == 0) {
            res.status(404).send({ result: 0, message: "DataType Not found!" });
            return;
        }

        if (dataType) {
            next();
            return;
        }
        res.status(404).send({ result: 0, message: "DataType Not found!" });
    });
};

checkDateTypeCanDelete = (req, res, next) => {
    const dataType = req.body.id;
    const query = { dataType: dataType, deleted: false };
    Attribute.find(query).then((attributes) => {
        if (attributes && attributes.length > 0) {
            res.status(400).send({ result: 0, message: "This datatype can't be deleted" });
        } else {
            next();
        }
    }).catch((err) => {
        next();
    });
};

const dataTypeCheck = {
    checkDataTypeExist,
    checkDateTypeCanDelete
};

module.exports = dataTypeCheck;
