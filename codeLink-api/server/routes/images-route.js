const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

const fs = require("fs");
const path = require('path');

app.get("/img/:img", (req, res) => {
  
  const img = req.params.img;

  let imgPath = path.resolve(__dirname, `../../uploads/${img}`);

  res.sendFile(imgPath);
});

module.exports = app;
