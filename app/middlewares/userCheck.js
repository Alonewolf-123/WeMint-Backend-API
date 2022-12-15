const utils = require("../utils/utils");
const db = require("../models");
const AssetBank = require("../models/assetBank/assetBank.model");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
  // Email
  User.findOne({
    email: req.body.email
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ result: 0, message: err });
      return;
    }

    if (user) {
      res.status(400).send({ result: 0, message: "Failed! Email is already in use!" });
      return;
    }

    next();
  });
};

checkUserExist = (req, res, next) => {
  // user
  User.findOne({
    _id: req.body.id
  }).exec((err, user) => {
    if (err || user == null || user == undefined || user.length == 0) {
      res.status(404).send({ result: 0, message: "User Not found!" });
      return;
    }

    if (user) {
      next();
      return;
    }
    res.status(404).send({ result: 0, message: "User Not found!" });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          result: 0,
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

checkValidParams = (req, res, next) => {
  const password = req.body.password;
  let invalidMessage = "";
  if (utils.isEmpty(password)) {
    invalidMessage = "Password is not valid!";
  }
  if (!utils.isEmpty(invalidMessage)) {
    res.status(400).send({ result: 0, message: invalidMessage });
    return;
  }
  next();
};

checkUserCanDelete = (req, res, next) => {
  const query = { deleted: false, user: req.body.id };
  AssetBank.find(query).then((assetBanks) => {
    if (assetBanks && assetBanks.length > 0) {
      res.status(400).send({ result: 0, message: "This user can't be deleted" });
    } else {
      next();
    }
  }).catch((err) => {
    next();
  });
};

const userCheck = {
  checkDuplicateEmail,
  checkRolesExisted,
  checkValidParams,
  checkUserExist,
  checkUserCanDelete
};

module.exports = userCheck;
