const { authJwt, assetBankCheck } = require("../middlewares");
const controller = require("../controllers/assetBank.controller");

module.exports = function (app) {

    app.post(
        "/api/admin/assetbank/create",
        [authJwt.verifyToken, authJwt.isAdmin],
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

    app.post(
        "/api/admin/assetbank/restore",
        [authJwt.verifyToken, authJwt.isAdmin],
        [
            assetBankCheck.checkAssetBankExist
        ],
        controller.restoreAssetBank
    );

    app.post(
        "/api/admin/assetbank/update",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.updateAssetBank
    );

    app.post(
        "/api/admin/assetbank/changeuser",
        [authJwt.verifyToken, authJwt.isAdmin],
        [
            assetBankCheck.checkAssetBankExist
        ],
        controller.changeUser
    );

    app.get(
        "/jsonurl/:tokenId",
        controller.jsonUrl
    );

};
