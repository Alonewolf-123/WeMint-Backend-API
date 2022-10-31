const utils = require("../utils/utils");
const db = require("../models");
const DataType = db.dataType;


checkDataTypeExist = (req, res, next) => {
    // dataType
    DataType.findOne({
        _id: req.body.id
    }).exec((err, dataType) => {
        if (err) {
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

const dataTypeCheck = {
    checkDataTypeExist
};

module.exports = dataTypeCheck;
