const config = require("../config/auth.config");
const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const utils = require("../utils/utils");

exports.signup = (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ result: 0, message: err.message });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ result: 0, message: err });
              return;
            }

            res.send({ result: 1, message: "User was created successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "admin" }, (err, role) => {
        if (err) {
          res.status(500).send({ result: 0, message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
          }

          res.send({ result: 1, message: "User was created successfully!" });
        });
      });
    }
  });
};

exports.resetPassword = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
        res.status(500).send({ result: 0, message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ result: 0, message: "User Not found!" });
      }

      if (utils.isEmpty(req.body.password)) {
        return res.status(200).send({
          result: 0,
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      if (utils.isEmpty(req.body.newpassword)) {
        return res.status(200).send({
          result: 0,
          message: "Invalid New Password!",
        });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(200).send({
          result: 0,
          message: "Invalid Password!",
        });
      }

      User.findOneAndUpdate({ email: req.body.email }, { password: bcrypt.hashSync(req.body.newpassword, 8) }, {
        new: false
      }, function (err, user) {
        if (err) {
          res.status(500).send({ result: 0, message: err });
          return;
        }
        res.status(200).send({ result: 1, message: 'Password was updated successfully!' });
      });
    });
};

exports.updateUser = (req, res) => {
  const user = req.body.id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  let data = { firstName: firstName, lastName: lastName };
  User.findOneAndUpdate({ _id: user }, data, {
    new: false
  }, function (err, user) {
    if (err) {
      res.status(500).send({ result: 0, message: err });
      return;
    }
    res.status(200).send({ result: 1, message: 'User was updated successfully!' });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
        res.status(500).send({ result: 0, message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ result: 0, message: "User Not found!" });
      }

      if (user && user.deleted) {
        return res.status(200).send({ result: 0, message: "You were deleted and able to do nothing!" });
      }
  
      if (user && user.locked != undefined && user.locked) {
        return res.status(200).send({ result: 0, message: "You were locked and able to do nothing!" });
      }

      if (utils.isEmpty(req.body.password)) {
        return res.status(200).send({
          result: 0,
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(200).send({
          result: 0,
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push(user.roles[i].name);
      }
      res.status(200).send({
        result: 1,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roles: authorities,
          accessToken: token,
          refreshToken: refreshToken
        }
      });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ result: 0, message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ result: 0, message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();

      res.status(403).json({
        result: 0,
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      result: 1,
      token: {
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      }
    });
  } catch (err) {
    return res.status(500).send({ result: 0, message: err });
  }
};
