const express = require("express");
const app = express();

const path = require('path');

app.get("/img/:img", (req, res) => {
  
  const img = req.params.img;

  let imgPath = path.resolve(__dirname, `../../uploads/${img}`);

  res.sendFile(imgPath);
});

module.exports = app;
