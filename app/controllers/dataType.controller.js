const db = require("../models");
const DataType = db.dataType;


exports.allDataTypes = (req, res) => {

    // (deleted == false) && (type like search || label like search || value like search)

    const search = req.query.search ? req.query.search : '';
    const query = search ? { $and: [{ deleted: false }, { $or: [{ type: { '$regex': search } }, { label: { '$regex': search } }, { value: { '$regex': search } }] }] } : { deleted: false };

    DataType.aggregate([
        { $match: query },
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

exports.updateDataType = (req, res) => {

    const dataType = req.body.id;
    const type = req.body.type;
    const label = req.body.label;
    const value = req.body.value;

    DataType.findOneAndUpdate({ _id: dataType }, { type: type, label: label, value }, {
        new: true
    }, function (err, dataType) {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
        res.status(200).send({ result: 1, message: 'DataType was updated successfully!' });
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
        type: req.body.type,
        label: req.body.label,
        value: req.body.value
    });

    dataType.save((err, dataType) => {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }

        res.send({ result: 1, message: "DataType was created successfully!", data: dataType });
    });
};