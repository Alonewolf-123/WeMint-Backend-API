const utils = require("../utils/utils");
const db = require("../models");
const Category = db.category;


checkCategoryExist = (req, res, next) => {
    // categoryId
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

checkValidParams = (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;
    let invalidMessage = "";
    if (utils.isEmpty(name)) {
        invalidMessage = "Category Name is not valid!";
    }
    if (utils.isEmpty(description)) {
        invalidMessage += utils.isEmpty(invalidMessage) ? "Category Description is not valid!" : "\n" + "Category Description is not valid!";
    }
    if (!utils.isEmpty(invalidMessage)) {
        res.status(400).send({ result: 0, message: invalidMessage });
        return;
    }

    next();
};

const categoryCheck = {
    checkCategoryExist,
    checkValidParams
};

module.exports = categoryCheck;
