const db = require("../models");
const utils = require("../utils/utils");
const Category = db.category;


exports.allCategories = (req, res) => {

    // (deleted == deleted) && (name like search && description like date)

    let deleted = false;
    if (req.query.deleted != undefined) {
        if (req.query.deleted == true || req.query.deleted.toLowerCase().trim() == 'true') {
            deleted = true;
        }
    }
    const pageOptions = {
        page: parseInt(req.query.page, 0) || 0,
        limit: parseInt(req.query.limit, 10) || 10
    };
    const search = req.query.search ? req.query.search : '';
    const query = !utils.isEmpty(search) ? { $and: [{ deleted: deleted }, { $or: [{ name: { '$regex': search, '$options': "i" } }, { description: { '$regex': search, '$options': "i" } }] }] } : { deleted: deleted };


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
        let categories = result.paginatedResults;
        try {
            const totalPageCount = Math.floor(result.totalCount[0].count / pageOptions.limit) + 1;
            res.status(200).send({ result: 1, data: categories, pageCount: totalPageCount, page: pageOptions.page, pageLimit: pageOptions.limit });
            return;
        } catch (error) {
            res.status(200).send({ result: 1, data: [], page: pageOptions.page, pageLimit: pageOptions.limit });
            return;
        }
    }).catch(err => {
        console.log(err);
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

exports.restoreCategory = (req, res) => {
    const category = req.body.id;
    Category.updateMany({ _id: category }, { deleted: false }, {
        new: false
    }, function (err, category) {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
        res.status(200).send({ result: 1, message: 'Category was restored successfully!' });
    });
};

exports.delCategory = (req, res) => {
    const category = req.body.id;
    const permanent = req.body.permanent != undefined ? req.body.permanent : false;
    console.log(req.body);
    if(permanent) {
        Category.remove({ _id: category }, function (err) {
            if (err) {
                res.status(500).send({ result: 0, message: err });
                return;
            }
            res.status(200).send({ result: 1, message: 'Category was deleted permanently!' });
        });
    } else {
        Category.updateMany({ _id: category }, { deleted: true }, {
            new: false
        }, function (err, category) {
            if (err) {
                res.status(500).send({ result: 0, message: err });
                return;
            }
            res.status(200).send({ result: 1, message: 'Category was deleted successfully!' });
        });
    }
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