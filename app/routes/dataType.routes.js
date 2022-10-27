const { authJwt, dataTypeCheck } = require("../middlewares");
const controller = require("../controllers/dataType.controller");

module.exports = function (app) {

    app.post(
        "/api/admin/datatype/create",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.createDataType
    );

    app.get(
        "/api/admin/datatypes/all",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.allDataTypes
    );

    app.post(
        "/api/admin/datatype/del",
        [authJwt.verifyToken, authJwt.isAdmin],
        [
            dataTypeCheck.checkDataTypeExist
        ],
        controller.delDataType
    );

};
