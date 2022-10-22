const db = require("../models");
const User = db.user;


exports.allUsers = (req, res) => {
  User.find({}, function (err, users) {

    if (err) {
      res.status(500).send({ result: 0, message: err });
      return;
    }

    res.status(200).send({ result: 1, users: users });
  });
};

exports.delUser = (req, res) => {
  const userId = req.body.id;
  User.findOneAndUpdate({ _id: userId }, { deleted: true }, {
    new: true
  }, function (err, user) {
    if (err) {
      res.status(500).send({ result: 0, message: err });
      return;
    }
    res.status(200).send({ result: 1, user: user, message: 'User was deleted successfully!' });
  });
};