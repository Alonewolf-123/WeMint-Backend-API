const { userCheck } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.post(
    "/api/auth/signup",
    [
      userCheck.checkValidParams,
      userCheck.checkDuplicateEmail,
      userCheck.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/refreshtoken", controller.refreshToken);
};
