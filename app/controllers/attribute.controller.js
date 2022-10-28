const db = require("../models");
const Attribute = db.attribute;


exports.allAttributes = (req, res) => {
    Attribute.find({deleted: false}).populate("category").populate("dataType").then((attributes) => {
        res.status(200).send({ result: 1, data: attributes });
    }).catch((err) => {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
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