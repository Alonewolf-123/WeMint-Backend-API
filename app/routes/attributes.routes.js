const { authJwt, attributeCheck } = require("../middlewares");
const controller = require("../controllers/attribute.controller");

module.exports = function (app) {

    app.post(
        "/api/admin/attribute/create",
        [authJwt.verifyToken, authJwt.isAdmin],
        [
            attributeCheck.checkValidParams
        ],
        controller.createAttribute
    );

    app.get(
        "/api/admin/attributes/all",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.allAttributes
    );

    app.post(
        "/api/admin/attribute/del",
        [authJwt.verifyToken, authJwt.isAdmin],
        [
            attributeCheck.checkAttributeExist
        ],
        controller.delAttribute
    );

};