const { authJwt, assetBankCheck } = require("../middlewares");
const controller = require("../controllers/assetBank.controller");

module.exports = function (app) {

    app.post(
        "/api/admin/assetbank/create",
        [authJwt.verifyToken, authJwt.isAdmin],
        [
            assetBankCheck.checkValidParams
        ],
        controller.createAssetBank
    );

    app.get(
        "/api/admin/assetbanks/all",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.allAssetBanks
    );

    app.post(
        "/api/admin/assetbank/del",
        [authJwt.verifyToken, authJwt.isAdmin],
        [
            assetBankCheck.checkAssetBankExist
        ],
        controller.delAssetBank
    );

};
