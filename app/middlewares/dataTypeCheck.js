const utils = require("../utils/utils");
const db = require("../models");
const DataType = db.dataType;


checkDataTypeExist = (req, res, next) => {
    // dataTypeId
    DataType.findOne({
        _id: req.body.id
    }).exec((err, dataType) => {
        if (err) {
            res.status(404).send({ result: 0, message: "DataType Not found!" });
            return;
        }

        if (dataType) {
            if (dataType.deleted) {
                res.status(400).send({
                    result: 0,
                    message: `DataType was deleted already!`
                });
                return;
            }
            next();
            return;
        }
        res.status(404).send({ result: 0, message: "DataType Not found!" });
    });
};

checkValidParams = (req, res, next) => {
    const type = req.body.type;
    const label = req.body.label;
    const value = req.body.value;
    let invalidMessage = "";
    if (utils.isEmpty(type)) {
        invalidMessage = "Type is not valid!";
    }
    if (utils.isEmpty(label)) {
        invalidMessage += utils.isEmpty(invalidMessage) ? "DataType label is not valid!" : "\n" + "DataType label is not valid!";
    }
    if (utils.isEmpty(value)) {
        invalidMessage += utils.isEmpty(invalidMessage) ? "DataType value is not valid!" : "\n" + "DataType value is not valid!";
    }
    if (!utils.isEmpty(invalidMessage)) {
        res.status(400).send({ result: 0, message: invalidMessage });
        return;
    }

    next();
};

const dataTypeCheck = {
    checkDataTypeExist,
    checkValidParams
};

module.exports = dataTypeCheck;
