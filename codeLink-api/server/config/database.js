let moongose = require("mongoose");

let db = "codeLink";
let port = "27017";
let host = "localhost";

class Database {
  constructor() {
    this.dbConnect();
  }

  dbConnect() {
    moongose
      .connect(`mongodb://${host}:${port}/${db}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res) => console.log('Conexion con db exitosa'))
      .catch((err) => console.err);
  }
}

module.exports = new Database();
