const { authJwt } = require("../middleware");
const controller = require("../controllers/coin.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get("/api/getCoinsList", controller.getCoinsList);
  app.get("/api/setCoinsDetails", controller.setCoinsDetails);
  app.get("/api/getCoinsDetails", controller.getCoinsDetails);
  app.post("/api/addFavCoins",[authJwt.verifyToken], controller.addFavCoins);
  app.post("/api/getFavCoins",[authJwt.verifyToken], controller.getFavCoins);
};
