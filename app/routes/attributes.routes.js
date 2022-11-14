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

    app.post(
        "/api/admin/attribute/restore",
        [authJwt.verifyToken, authJwt.isAdmin],
        [
            attributeCheck.checkAttributeExist
        ],
        controller.restoreAttribute
    );
    
    app.post(
        "/api/admin/attribute/update",
        [authJwt.verifyToken, authJwt.isAdmin],
        [
            attributeCheck.checkAttributeExist,
            attributeCheck.checkValidParams
        ],
        controller.updateAttribute
    );
};
