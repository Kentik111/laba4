const db = require("../models/db_model");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Проверка на наличие данных
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(400).send({ message: "Тело запроса не может быть пустым!" });
  }

  // Сохранение пользователя в базе данных
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "Регистрация прошла успешно!" });
          });
        });
      } else {
        // Установка роли по умолчанию
        user.setRoles([1]).then(() => {
          res.send({ message: "Регистрация прошла успешно!" });
        });
      }
    })
    .catch(err => {
      console.error("Ошибка при регистрации:", err);
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Некоректный пароль!"
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 часа
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        // Установка токена в куки
        res.cookie('accessToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 86400 * 1000 // 24 часа
        });

        // Ответ с данными пользователя
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      console.error("Error during signin:", err);
      res.status(500).send({ message: err.message });
    });
};
