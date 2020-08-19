require("./config/config");

const express = require("express");
const database = require('./config/database');
const path = require("path");

const app = express();
const cors = require("cors");

const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("./routes/index-route"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Ruta no valida");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log("Servidor inicado en el puerto 3000");
});
