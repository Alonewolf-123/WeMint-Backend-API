const db = require("../models");
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

    DataType.findOneAndUpdate({ _id: dataType }, { type: type, label: label, value }, {
        new: false
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
    DataType.updateMany({ _id: dataType }, { deleted: true }, {
        new: false
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