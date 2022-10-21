const utils = require("../utils/utils");
const db = require("../models/user");
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
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  let invalidMessage = "";
  if (utils.isEmpty(firstName)) {
    invalidMessage = "First Name is not valid!";
  }
  if (utils.isEmpty(lastName)) {
    invalidMessage += utils.isEmpty(invalidMessage) ? "Last Name is not valid!" : "\n" + "Last Name is not valid!";
  }
  if (!utils.checkemail(email)) {
    invalidMessage += utils.isEmpty(invalidMessage) ? "Email is not valid!" : "\n" + "Email is not valid!";
  }
  if (utils.isEmpty(password)) {
    invalidMessage += utils.isEmpty(invalidMessage) ? "Password is not valid!" : "\n" + "Password is not valid!";
  }
  if (!utils.isEmpty(invalidMessage)) {
    res.status(400).send({ result: 0, message: invalidMessage });
    return;
  }

  next();
};

const verifySignUp = {
  checkDuplicateEmail,
  checkRolesExisted,
  checkValidParams
};

module.exports = verifySignUp;
