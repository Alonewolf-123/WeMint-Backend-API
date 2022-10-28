const db = require("../models");
const DataType = db.dataType;


exports.allDataTypes = (req, res) => {
    DataType.aggregate([
        { $match: { deleted: false } },
        { $sort: { name: -1 } },
        {
            $lookup: {
                from: 'attributes',
                pipeline: [
                    {
                        $match: { deleted: false }
                    }
                ],
                localField: '_id',
                foreignField: 'dataType',
                as: 'attributes'
            }
        }
    ]).then(dataTypes => {
        res.status(200).send({ result: 1, data: dataTypes });
    }).catch(err => {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
    });
};

exports.delDataType = (req, res) => {
    const dataType = req.body.id;
    DataType.findOneAndUpdate({ _id: dataType }, { deleted: true }, {
        new: true
    }, function (err, dataType) {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
        res.status(200).send({ result: 1, message: 'DataType was deleted successfully!' });
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

        res.send({ result: 1, message: "DataType was created successfully!", data: dataType });
    });
};