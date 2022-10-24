const { authJwt, categoryCheck } = require("../middlewares");
const controller = require("../controllers/category.controller");

module.exports = function (app) {

    app.post(
        "/api/admin/category/create",
        [authJwt.verifyToken, authJwt.isAdmin],
        [
            categoryCheck.checkValidParams
        ],
        controller.createCategory
    );

    app.get(
        "/api/admin/categories/all",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.allCategories
    );

    app.post(
        "/api/admin/category/del",
        [authJwt.verifyToken, authJwt.isAdmin],
        [
            categoryCheck.checkCategoryExist
        ],
        controller.delCategory
    );

};