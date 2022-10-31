const db = require("../models");
const utils = require("../utils/utils");
const Attribute = db.attribute;


exports.allAttributes = (req, res) => {

    // (deleted == false) && (attribute like search && category == category)

    const search = req.query.search ? req.query.search : '';
    const category = req.query.category ? req.query.category : '';
    let query;
    if (!utils.isEmpty(search) && !utils.isEmpty(category)) {
        query = { $and: [{ deleted: false }, { attribute: { '$regex': search } }, { category: category }] };
    } else if (!utils.isEmpty(search)) {
        query = { $and: [{ deleted: false }, { attribute: { '$regex': search } }] };
    } else if (!utils.isEmpty(category)) {
        query = { $and: [{ deleted: false }, { category: category }] };
    } else {
        query = { deleted: false };
    }

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
        new: true
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
    Attribute.findOneAndUpdate({ _id: attribute }, { deleted: true }, {
        new: true
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