const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const express = require("express");
const app = express();
const User = require("../models/user-model");

app.post("/login", (req, res) => {
  let body = req.body;

  User.findOne({ email: body.email }, { folders: 0, projects: 0})
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          ok: false,
          message: "Usuario o contraseña incorrecto",
        });
      }

      if (!bcrypt.compareSync(body.password, user.password)) {
        return res.status(400).json({
          ok: false,
          message: "Usuario o contraseña incorrecto",
        });
      }

      let token = jwt.sign({ data: user }, process.env.SEED, {
        expiresIn: process.env.JWTEXP,
      });

      delete user.folders;

      res.json({
          ok: true,
          user,
          token
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        ok: false,
        err,
      });
    });
});

module.exports = app;
