const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(200).send({ result: 0, message: "Unauthorized! Access Token was expired!" });
  }

  return res.status(200).send({ result: 0, message: "Unauthorized!" });
}

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ result: 0, message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.user = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.user).exec((err, user) => {
    if (err) {
      res.status(500).send({ result: 0, message: err });
      return;
    }

    if (user && user.deleted) {
      return res.status(200).send({ result: 0, message: "You were deleted and able to do nothing!" });
    }

    if (user && user.locked != undefined && user.locked) {
      return res.status(200).send({ result: 0, message: "You were locked and able to do nothing!" });
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ result: 0, message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ result: 0, message: "Require Admin Role!" });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin
};
module.exports = authJwt;
