const db = require("../models");
const Attribute = db.attribute;


exports.allAttributes = (req, res) => {
    Attribute.find({}, function (err, attributes) {

        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }

        res.status(200).send({ result: 1, attributes: attributes });
    });
};

exports.delAttribute = (req, res) => {
    const AttributeId = req.body.id;
    Attribute.findOneAndUpdate({ _id: AttributeId }, { deleted: true }, {
        new: true
    }, function (err, attribute) {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
        res.status(200).send({ result: 1, attribute: attribute, message: 'Attribute was deleted successfully!' });
    });
};

exports.createAttribute = (req, res) => {
    const attribute = new Attribute({
        categoryId: req.body.categoryId,
        attribute: req.body.attribute,
        dataTypeId: req.body.dataTypeId
      });
    
      attribute.save((err, attribute) => {
        if (err) {
          res.status(500).send({ result: 0, message: err });
          return;
        }
    
        res.send({ result: 1, message: "Attribute was created successfully!" });
      });
};