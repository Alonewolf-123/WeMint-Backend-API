const { authJwt, userCheck } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {

  app.get(
    "/api/admin/user/all",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.allUsers
  );

  app.post(
    "/api/admin/user/del",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      userCheck.checkUserExist,
      userCheck.checkUserCanDelete
    ],
    controller.delUser
  );

  app.post(
    "/api/admin/user/restore",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      userCheck.checkUserExist
    ],
    controller.restoreUser
  );

  app.post(
    "/api/admin/user/lockandunlock",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      userCheck.checkUserExist
    ],
    controller.lockAndUnlockUser
  );

  app.post(
    "/api/admin/user/update",
    [authJwt.verifyToken, authJwt.isAdmin],
    [
      userCheck.checkUserExist
    ],
    controller.updateUser
  );
  
};
