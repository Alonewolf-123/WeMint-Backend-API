const db = require("../models");
const Category = db.category;


exports.allCategories = (req, res) => {
    Category.find({}, function (err, categories) {

        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }

        res.status(200).send({ result: 1, categories: categories });
    });
};

exports.delCategory = (req, res) => {
    const categoryId = req.body.id;
    Category.findOneAndUpdate({ _id: categoryId }, { deleted: true }, {
        new: true
    }, function (err, category) {
        if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
        }
        res.status(200).send({ result: 1, category: category, message: 'Category was deleted successfully!' });
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