const { verifySignUp,verifySignIn } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.isUsernameOrEmailOrPassword,
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post(
    "/api/auth/signin", 
    [
      verifySignIn.isUserEmailOrPassword
    ],
    controller.signin
  );

  app.post(
    "/api/auth/resetpassword", 
    [
      verifySignIn.isUserEmail
    ],
    controller.resetpassword
  );
  
  app.post(
    "/api/auth/verify_rp_token", 
    [
      verifySignIn.isUserEmail
    ],
    controller.verify_rp_token
  );

  app.post(
    "/api/auth/newpassword",
    controller.newpassword
  );

  app.post("/api/auth/refreshtoken", controller.refreshToken);
};
