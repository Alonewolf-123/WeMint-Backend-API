const utils = require("../utils/utils");
const db = require("../models");
const Category = db.category;


checkCategoryExist = (req, res, next) => {
    // category
    Category.findOne({
        _id: req.body.id
    }).exec((err, category) => {
        if (err) {
            res.status(404).send({ result: 0, message: "Category Not found!" });
            return;
        }

        if (category) {
            if (category.deleted) {
                res.status(400).send({
                    result: 0,
                    message: `Category was deleted already!`
                });
                return;
            }
            next();
            return;
        }
        res.status(404).send({ result: 0, message: "Category Not found!" });
    });
};

const categoryCheck = {
    checkCategoryExist
};

module.exports = categoryCheck;
