const { authJwt } = require("../middleware");
const CourseController = require("../controllers/course_control");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/courses",
    [authJwt.verifyToken],
    CourseController.create
  );

  app.get(
    "/api/courses",
    [authJwt.verifyToken],
    CourseController.findAll
  );

  app.get(
    "/api/courses/:id",
    [authJwt.verifyToken],
    CourseController.findOne
  );

  app.put(
    "/api/courses/:id",
    [authJwt.verifyToken],
    CourseController.update
  );

  app.delete(
    "/api/courses/:id",
    [authJwt.verifyToken],
    CourseController.delete
  );

  app.get(
    "/api/courses/merchandiser/allcourses",
    [authJwt.verifyToken, authJwt.isMerchandiser],
    CourseController.findAllMerchandiser
  );

  app.get(
    "/api/courses/public",
    CourseController.findAllPublic
  );
};