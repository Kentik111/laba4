const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/db_model.js");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "Токен отсутствует!"
    });
  }

  jwt.verify(token,
            config.secret,
            (err, decoded) => {
              if (err) {
                return res.status(401).send({
                  message: "Пользователь не авторизован!",
                });
              }
              req.userId = decoded.id;
              next();
            });
};

isMerchandiser = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "merchandiser") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Требуется роль товароведа!"
      });
    });
  });
};


const authJwt = {
  verifyToken: verifyToken,
  isMerchandiser: isMerchandiser
};
module.exports = authJwt;