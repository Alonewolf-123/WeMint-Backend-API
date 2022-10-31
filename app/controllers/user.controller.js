const db = require("../models");
const utils = require("../utils/utils");
const User = db.user;


exports.allUsers = (req, res) => {
  // (deleted == false) && (firstName like search || lastName like search || email like search)
  const search = req.query.search ? req.query.search : '';
  const query = !utils.isEmpty(search) ? { $and: [{ deleted: false }, { $or: [{ firstName: { '$regex': search } }, { lastName: { '$regex': search } }, { email: { '$regex': search } }] }] } : { deleted: false };
  User.find(query).populate("roles").then((users) => {
    res.status(200).send({ result: 1, users: users });
  }).catch((err) => {
    if (err) {
      res.status(500).send({ result: 0, message: err });
      return;
    }
  });
};

exports.updateUser = (req, res) => {
  const user = req.body.id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  console.log({ firstName: firstName, lastName: lastName, email: email });
  User.findOneAndUpdate({ _id: user }, { firstName: firstName, lastName: lastName, email: email }, {
    new: true
  }, function (err, user) {
    if (err) {
      res.status(500).send({ result: 0, message: err });
      return;
    }
    res.status(200).send({ result: 1, message: 'User was updated successfully!' });
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