const { authJwt } = require("../middleware");
const controller = require("../controllers/user_control");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  
  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/test/merchandiser",
    [authJwt.verifyToken, authJwt.isMerchandiser],
    controller.merchandiserBoard
  );

};