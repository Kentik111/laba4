exports.allAccess = (req, res) => {
    res.status(200).send("Главная");
  };
 exports.merchandiserBoard = (req, res) => {
    res.status(200).send("Главная страница Товароведа");
  };    
  exports.userBoard = (req, res) => {
    res.status(200).send("Профиль пользователя");
  };
   
 