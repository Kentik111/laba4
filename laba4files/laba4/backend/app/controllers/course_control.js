const db = require("../models/db_model");
const Courses = db.courses; 
const Op = db.Sequelize.Op;

// Создание
exports.create = (req, res) => {
  // Валидация
  if (!req.body.title) {
    return res.status(400).send({
      message: "Заголовок не может быть пустым"
    });
  }

  // Создаем объект курса
  const course = {
    title: req.body.title,
    description: req.body.description,
    public: req.body.public || false // исправлено на английскую 'c'
  };

  // Используем модель Courses (объявленную в начале файла)
  Courses.create(course) // <-- исправлено здесь
    .then(data => {
      res.status(201).send(data);
    })
    .catch(err => {
      console.error("Ошибка создания курса:", err); // Добавьте логирование
      res.status(500).send({
        message: err.message || "При создании курса произошла ошибка"
      });
    });
};

// Получение всех курсов с фильтрацией
exports.findAll = (req, res) => {

  if (!Courses) {
    return res.status(500).send({
      message: "Модель курсов не определена"
    });
  }
  const { title, publiс, quantity} = req.query;
  let where = {};

  if (title) where.title = { [Op.like]: `%${title}%` };
  if (publiс) where.public = public === 'true';
  
  Courses.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "При извлечении курсов произошла некоторая ошибка"
      });
    });
};

// Получение одного курса по ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Courses.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Не нашлось курса с таким id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Ошибка при извлечении курса с id=${id}`
      });
    });
};

// Обновление по ID
exports.update = (req, res) => {
  const id = req.params.id;

  Courses.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Курс был успешно обновлен"
        });
      } else {
        res.status(404).send({
          message: `Невозможно обновить курс с id=${id}. Возможно, курс не был найден или тело запроса пусто!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Невозможно обновить курс с id=${id}`
      });
    });
};

// Удаление по ID
exports.delete = (req, res) => {
  const id = req.params.id;

  Courses.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Курс успешно удален!"
        });
      } else {
        res.status(404).send({
          message: `Невозможно удалить курс с id=${id}. Возможно курс отсутствует!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Невозможно удалить курс с id=${id}`
      });
    });
};

// Удаление всех курсов
exports.deleteAll = (req, res) => {
  Courses.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Курсы успешно удалены!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "При удалении всех курсов произошла некоторая ошибка"
      });
    });
};

// Поиск всех опубликованных курсов
exports.findAllPublic = (req, res) => {
  Courses.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "При извлечении опубликованных курсов произошла некоторая ошибка"
      });
    });
};
// Получение всех (включая неопубликованные)
exports.findAllMerchandiser = (req, res) => {
  const {title} = req.query;
  let where = {};

  // Фильтрация (без учета public)
  if (title) where.title = { [Op.like]: `%${title}%` };

  Courses.findAll({ where })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "При получении всех курсов для товароведа произошла некоторая ошибка"
      });
    });
};
