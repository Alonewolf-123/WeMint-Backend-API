const db = require("../models");
const User = db.user;


exports.allUsers = (req, res) => {

  User.find({ deleted: false }).populate("roles").then((users) => {
    res.status(200).send({ result: 1, users: users });
  }).catch((err) => {
    if (err) {
      res.status(500).send({ result: 0, message: err });
      return;
    }
  });
};

exports.delUser = (req, res) => {
  const user = req.body.id;
  User.findOneAndUpdate({ _id: user }, { deleted: true }, {
    new: true
  }, function (err, user) {
    if (err) {
      res.status(500).send({ result: 0, message: err });
      return;
    }
    res.status(200).send({ result: 1, message: 'User was deleted successfully!' });
  });
};