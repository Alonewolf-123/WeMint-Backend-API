const db = require("../models");
const DataType = db.dataType;


exports.allDataTypes = (req, res) => {
    DataType.find({}, function (err, categories) {

        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }

        res.status(200).send({ result: 1, categories: categories });
    });
};

exports.delDataType = (req, res) => {
    const dataTypeId = req.body.id;
    DataType.findOneAndUpdate({ _id: dataTypeId }, { deleted: true }, {
        new: true
    }, function (err, dataType) {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
        res.status(200).send({ result: 1, dataType: dataType, message: 'DataType was deleted successfully!' });
    });
};

exports.createDataType = (req, res) => {
    const dataType = new DataType({
        name: req.body.name,
        description: req.body.description
      });
    
      dataType.save((err, dataType) => {
        if (err) {
          res.status(500).send({ result: 0, message: err });
          return;
        }
    
        res.send({ result: 1, message: "DataType was created successfully!" });
      });
};