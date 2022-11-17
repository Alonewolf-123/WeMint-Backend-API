const db = require("../models");
const utils = require("../utils/utils");
const DataType = db.dataType;


exports.allDataTypes = (req, res) => {

    // (deleted == deleted) && (type like search || label like search || value like search)

    let deleted = false;
    if (req.query.deleted != undefined) {
        if (req.query.deleted == true || req.query.deleted.toLowerCase().trim() == 'true') {
            deleted = true;
        }
    }
    const search = req.query.search ? req.query.search : '';
    const query = search ? { $and: [{ deleted: deleted }, { $or: [{ type: { '$regex': search, '$options': "i" } }, { label: { '$regex': search, '$options': "i" } }, { value: { '$regex': search, '$options': "i" } }] }] } : { deleted: false };
    const pageOptions = {
        page: parseInt(req.query.page, 0) || 0,
        limit: parseInt(req.query.limit, 10) || 10
    };
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
        },
        {
            $facet: {
                paginatedResults: [{ $skip: pageOptions.page * pageOptions.limit }, { $limit: pageOptions.limit }],
                totalCount: [
                    {
                        $count: 'count'
                    }
                ]
            }
        }
    ]).then(result => {

        result = result[0];
        let dataTypes = result.paginatedResults;
        try {
            const totalPageCount = Math.floor(result.totalCount[0].count / pageOptions.limit) + 1;
            res.status(200).send({ result: 1, data: dataTypes, pageCount: totalPageCount, page: pageOptions.page, pageLimit: pageOptions.limit });
            return;
        } catch (error) {
            res.status(200).send({ result: 1, data: [], page: pageOptions.page, pageLimit: pageOptions.limit });
            return;
        }
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
    const parameter = req.body.parameter;

    if(!utils.isEmpty(value)) {
        if(!utils.isBase64String(value)) {
            res.status(400).send({ result: 0, message: "Value should be base64 string!" });
            return;
        }
    }

    DataType.findOneAndUpdate({ _id: dataType }, { type: type, label: label, value: value, parameter: parameter }, {
        new: false
    }, function (err, dataType) {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
        res.status(200).send({ result: 1, message: 'DataType was updated successfully!' });
    });
};

exports.restoreDataType = (req, res) => {
    const dataType = req.body.id;
    DataType.updateMany({ _id: dataType }, { deleted: false }, {
        new: false
    }, function (err, dataType) {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
        res.status(200).send({ result: 1, message: 'DataType was restored successfully!' });
    });
};

exports.delDataType = (req, res) => {
    const dataType = req.body.id;
    const permanent = req.body.permanent != undefined ? req.body.permanent : false;
    if(permanent) {
        DataType.remove({ _id: dataType }, function (err, dataType) {
            if (err) {
                res.status(500).send({ result: 0, message: err });
                return;
            }
            res.status(200).send({ result: 1, message: 'DataType was deleted permanently!' });
        });
    } else {
        DataType.updateMany({ _id: dataType }, { deleted: true }, {
            new: false
        }, function (err, dataType) {
            if (err) {
                res.status(500).send({ result: 0, message: err });
                return;
            }
            res.status(200).send({ result: 1, message: 'DataType was deleted successfully!' });
        });
    }
};

exports.createDataType = (req, res) => {
    let value = req.body.value;
    if(!utils.isBase64String(value)) {
        res.status(400).send({ result: 0, message: "Value should be base64 string!" });
        return;
    }
    const dataType = new DataType({
        type: req.body.type,
        label: req.body.label,
        value: req.body.value,
        parameter: req.body.parameter
    });

    dataType.save((err, dataType) => {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }

        res.send({ result: 1, message: "DataType was created successfully!", data: dataType });
    });
};