const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user/user.model");
db.role = require("./user/role.model");
db.refreshToken = require("./user/refreshToken.model");
db.category = require("./category/category.model");
db.dataType = require("./dataType/dataType.model");
db.attribute = require("./attribute/attribute.model");
db.assetBank = require("./assetBank/assetBank.model");

db.ROLES = ["user", "admin"];

module.exports = db;