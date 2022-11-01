const db = require("../models");
const utils = require("../utils/utils");
const Attribute = db.attribute;


exports.allAttributes = (req, res) => {

    // (deleted == deleted) && (attribute like search && category == category)

    let deleted = false;
    if (req.query.deleted != undefined) {
        if (req.query.deleted == true || req.query.deleted.toLowerCase().trim() == 'true') {
            deleted = true;
        }
    }
    const search = req.query.search ? req.query.search : '';
    const category = req.query.category ? req.query.category : '';

    let conditions = [{ deleted: deleted }];

    if (!utils.isEmpty(search)) {
        conditions.push({ attribute: { '$regex': search } });
    }

    if (!utils.isEmpty(category)) {
        conditions.push({ category: category });
    }

    query = { $and: conditions };

    Attribute.find(query).populate("category").populate("dataType").then((attributes) => {
        res.status(200).send({ result: 1, data: attributes });
    }).catch((err) => {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
    });
};

exports.updateAttribute = (req, res) => {
    const attribute = req.body.id;
    Attribute.findOneAndUpdate({ _id: attribute }, {
        category: req.body.category,
        attribute: req.body.attribute,
        dataType: req.body.dataType
    }, {
        new: false
    }, function (err, attribute) {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
        res.status(200).send({ result: 1, message: 'Attribute was updated successfully!' });
    });
};

exports.delAttribute = (req, res) => {
    const attribute = req.body.id;
    Attribute.updateMany({ _id: attribute }, { deleted: true }, {
        new: false
    }, function (err, attribute) {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
        res.status(200).send({ result: 1, message: 'Attribute was deleted successfully!' });
    });
};

exports.createAttribute = (req, res) => {
    const attribute = new Attribute({
        category: req.body.category,
        attribute: req.body.attribute,
        dataType: req.body.dataType
    });

    attribute.save((err, attribute) => {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }

        res.send({ result: 1, message: "Attribute was created successfully!" });
    });
};