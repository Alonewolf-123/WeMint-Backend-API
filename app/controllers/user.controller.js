const db = require("../models/user");
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
