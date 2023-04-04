const controller = require("../controllers/salesforce.controller");
const multer = require('multer');

module.exports = function (app) {

    app.post(
        "/api/upload", multer().single("file"),
        controller.upload
    );
};