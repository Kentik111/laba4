/*const express = require("express");
const cors = require("cors");
const winston = require('winston');
const expressWinston = require('express-winston');

// Создание экземпляра приложения
const app = express();

// Настройка логгера
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ]
});

// Логирование необработанных промисов
process.on('unhandledRejection', (ex) => {
  throw ex;
});

// Настройки CORS
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// Логирование запросов
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
}));

// Парсинг запросов с content-type application/json
app.use(express.json());

// Парсинг запросов с content-type application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Подключение маршрутов
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/incident.routes')(app);

const db = require("./app/models");
const Role = db.role;

// Логирование ошибок
app.use(expressWinston.errorLogger({
  winstonInstance: logger
}));

// Синхронизация базы данных
db.sequelize.sync().then(() => {
  logger.info('Database synchronized successfully.');
  initial();
}).catch(err => {
  logger.error('Database synchronization failed:', err);
});

// Простой маршрут
app.get("/", (req, res) => {
  logger.info('Welcome message sent');
  res.json({ message: "Welcome to application." });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// Установка порта и прослушивание запросов
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}.`);
});

// Инициализация ролей
function initial() {
  Role.findOrCreate({
    where: { id: 1 },
    defaults: { name: "user" }
  }).then(([role, created]) => {
    if (created) logger.info('Role "user" created');
  });

  Role.findOrCreate({
    where: { id: 2 },
    defaults: { name: "moderator" }
  }).then(([role, created]) => {
    if (created) logger.info('Role "moderator" created');
  });

  Role.findOrCreate({
    where: { id: 3 },
    defaults: { name: "admin" }
  }).then(([role, created]) => {
    if (created) logger.info('Role "admin" created');
  });
}
*/



// Импорт необходимых библиотек
const express = require("express");
const cors = require("cors");
const winston = require('winston');
const expressWinston = require('express-winston');

// Создание экземпляра приложения Express
const app = express();

// Настройка логгера с использованием Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(), // Логирование в консоль
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Логи ошибок
    new winston.transports.File({ filename: 'logs/combined.log' }) // Все логи
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }) // Логи необработанных исключений
  ]
});

// Обработка необработанных промисов
process.on('unhandledRejection', (ex) => {
  throw ex; // Пробрасываем исключение
});

// Настройки CORS для разрешения запросов с определенного источника
const corsOptions = {
  origin: "http://localhost:8081" // разрешенный источник
};

// Использование CORS
app.use(cors(corsOptions));

// Логирование входящих HTTP-запросов
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}', // Формат сообщения
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; } // Логируем все маршруты
}));

// Парсинг JSON и URL-encoded данных в запросах
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение маршрутов
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/courses.routes')(app);

// Импорт моделей базы данных
const db = require("./app/models/db_model");
const Role = db.role;

// Логирование ошибок
app.use(expressWinston.errorLogger({
  winstonInstance: logger // Используем тот же логгер для ошибок
}));

// Синхронизация базы данных
db.sequelize.sync()
  .then(() => {
    logger.info('Database synchronized successfully.'); // Успешная синхронизация
    initial(); // Инициализация ролей
  })
  .catch(err => {
    logger.error('Database synchronization failed:', err); // Ошибка синхронизации
  });

// Простой маршрут для проверки работы сервера
app.get("/", (req, res) => {
  logger.info('Welcome message sent'); // Логируем отправку приветственного сообщения
  res.json({ message: "Welcome to application." }); // Ответ клиенту
});

// Обработка ошибок
app.use((err, req, res, next) => {
  logger.error(err.stack); // Логируем стек ошибки
  res.status(500).send('Something broke!'); // Ответ с ошибкой
});

// Установка порта и запуск сервера
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}.`); // Логируем запуск сервера
});

// Функция для инициализации ролей в базе данных
function initial() {
  const roles = [
    { id: 1, name: "user" },
    { id: 2, name: "merchandiser" },
  ];

  roles.forEach(role => {
    Role.findOrCreate({
      where: { id: role.id },
      defaults: { name: role.name }
    }).then(([role, created]) => {
      if (created) logger.info(`Role "${role.name}" created`); // Логируем создание роли
    });
  });
}
