let moongose = require("mongoose");

class Database {
  constructor() {
    this.dbConnect();
  }

  dbConnect() {
    moongose
      .connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res) => console.log('Conexion con db exitosa'))
      .catch((err) => console.err);
  }
}

module.exports = new Database();
