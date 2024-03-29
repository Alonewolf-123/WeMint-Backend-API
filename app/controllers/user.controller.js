const db = require("../models");
const utils = require("../utils/utils");
const User = db.user;

const bcrypt = require("bcryptjs");
const { mongo } = require("mongoose");
const Role = require("../models/user/role.model");

exports.allUsers = (req, res) => {

  // (deleted == deleted) && (firstName like search || lastName like search || email like search)

  let deleted = false;
  if (req.query.deleted != undefined) {
    if (req.query.deleted == true || req.query.deleted.toLowerCase().trim() == 'true') {
      deleted = true;
    }
  }

  const pageOptions = {
    page: parseInt(req.query.page, 0) || 0,
    limit: parseInt(req.query.limit, 10) || 10
  };
  const search = req.query.search ? req.query.search : '';
  const queryList = [{ deleted: deleted }];
  if (!utils.isEmpty(search)) {
    queryList.push({ $or: [{ firstName: { '$regex': search, '$options': "i" } }, { lastName: { '$regex': search, '$options': "i" } }, { email: { '$regex': search, '$options': "i" } }] });
  }
  const role = req.query.role;
  Role.find(
    {
      name: role,
    },
    (err, roles) => {
      if (err) {
        res.status(500).send({ result: 0, message: err });
        return;
      }
      if (roles.length > 0) {
        let roleObjectIds = [];
        roles.forEach(element => {
          roleObjectIds.push(element['_id']);
        });
        queryList.push({ roles: { $in: roleObjectIds } });
      } else {
        if (role) {
          res.status(200).send({ result: 1, data: [] });
          return;
        }
      }

      const query = { $and: queryList };
      let cusor = User.find(query).skip(pageOptions.page * pageOptions.limit).limit(pageOptions.limit);
      cusor.count().then((count) => {
        const totalPageCount = Math.floor(count / pageOptions.limit) + 1;
        User.find(query).skip(pageOptions.page * pageOptions.limit).limit(pageOptions.limit).populate("roles").then((users) => {
          res.status(200).send({ result: 1, data: users, pageCount: totalPageCount, page: pageOptions.page, pageLimit: pageOptions.limit });
        }).catch((err) => {
          if (err) {
            res.status(500).send({ result: 0, message: err });
            return;
          }
        });
      }).catch((err) => {
        res.status(500).send({ result: 0, message: err });
      });

    }
  );
};

exports.updateUser = (req, res) => {
  const user = req.body.id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  let data = { firstName: firstName, lastName: lastName, email: email };
  if (!utils.isEmpty(req.body.password)) {
    data['password'] = bcrypt.hashSync(req.body.password, 8);
  }
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

exports.restoreUser = (req, res) => {
  const user = req.body.id;
  User.updateMany({ _id: user }, { deleted: false }, {
    new: false
  }, function (err, user) {
    if (err) {
      res.status(500).send({ result: 0, message: err });
      return;
    }
    res.status(200).send({ result: 1, message: 'User was restored successfully!' });
  });
};

exports.delUser = (req, res) => {
  const user = req.body.id;
  const permanent = req.body.permanent != undefined ? req.body.permanent : false;
  if (permanent) {
    User.remove({ _id: user }, function (err, user) {
      if (err) {
        res.status(500).send({ result: 0, message: err });
        return;
      }
      res.status(200).send({ result: 1, message: 'User was deleted permanently!' });
    });
  } else {
    User.updateMany({ _id: user }, { deleted: true }, {
      new: false
    }, function (err, user) {
      if (err) {
        res.status(500).send({ result: 0, message: err });
        return;
      }
      res.status(200).send({ result: 1, message: 'User was deleted successfully!' });
    });
  }
};

exports.lockAndUnlockUser = (req, res) => {
  const user = req.body.id;
  const locked = req.body.locked;
  User.updateMany({ _id: user }, { locked: locked }, {
    new: false
  }, function (err, user) {
    if (err) {
      res.status(500).send({ result: 0, message: err });
      return;
    }
    res.status(200).send({ result: 1, message: 'User was ' + (locked ? 'locked' : 'unlocked') + ' successfully!' });
  });
};