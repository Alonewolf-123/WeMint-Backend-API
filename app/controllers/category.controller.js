const db = require("../models");
const Category = db.category;


exports.allCategories = (req, res) => {
    Category.aggregate([
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

exports.delCategory = (req, res) => {
    const category = req.body.id;
    Category.findOneAndUpdate({ _id: category }, { deleted: true }, {
        new: true
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