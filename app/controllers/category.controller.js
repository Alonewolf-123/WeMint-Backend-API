const db = require("../models");
const utils = require("../utils/utils");
const Category = db.category;


exports.allCategories = (req, res) => {

    // (deleted == deleted) && (name like search && description like date)

    let deleted = false;
    if(req.query.deleted != undefined) {
        if(req.query.deleted == true || req.query.deleted.toLowerCase().trim() == 'true') {
            deleted = true;
        }
    }

    const search = req.query.search ? req.query.search : '';
    const query = !utils.isEmpty(search) ? { $and: [{ deleted: deleted }, { $or: [{ name: { '$regex': search } }, { description: { '$regex': search } }] }] } : { deleted: deleted };

    Category.aggregate([
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
                foreignField: 'category',
                as: 'attributes'
            }
        }
    ]).then(categories => {
        res.status(200).send({ result: 1, data: categories });
    }).catch(err => {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
    });
};

exports.updateCategory = (req, res) => {
    const category = req.body.id;
    const name = req.body.name;
    const description = req.body.description;
    Category.findOneAndUpdate({ _id: category }, { name: name, description: description }, {
        new: false
    }, function (err, category) {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
        res.status(200).send({ result: 1, message: 'Category was updated successfully!' });
    });
};

exports.delCategory = (req, res) => {
    const category = req.body.id;
    Category.updateMany({ _id: category }, { deleted: true }, {
        new: false
    }, function (err, category) {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
        res.status(200).send({ result: 1, message: 'Category was deleted successfully!' });
    });
};

exports.createCategory = (req, res) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description
    });

    category.save((err, category) => {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }

        res.send({ result: 1, message: "Category was created successfully!" });
    });
};