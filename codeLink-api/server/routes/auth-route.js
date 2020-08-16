const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const express = require("express");
const app = express();
const User = require("../models/user-model");

app.post("/login", (req, res) => {
  let body = req.body;

  User.findOne({ email: body.email }, { folders: 0, projects: 0 })
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

      delete user.folders;
      delete user.projects;

      let token = jwt.sign({ data: user }, process.env.SEED, {
        expiresIn: process.env.JWTEXP,
      });

      res.json({
        ok: true,
        user,
        token,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(422).json({
        ok: false,
        err,
      });
    });
});

app.post("/change-password/:id", (req, res) => {
  const user_id = req.params.id;
  let body = req.body;

  User.findOne({ _id: user_id })
    .then((user) => {
      if (!bcrypt.compareSync(body.oldPassword, user.password)) {
        return res.status(400).json({
          ok: false,
          message: "La contraseña actual no coincide",
        });
      }

      const password = bcrypt.hashSync(body.password, 10);

      return User.update({ _id: user_id }, { password });
    })
    .then((result) => {
      if (!result.nModified) {
        return res
          .status(422)
          .json({ ok: false, message: "No se pudo eliminar la carpeta" });
      }

      res.json({ message: "Contraseña actualizada con exito" });
    })
    .catch((err) => res.status(422).json({ message: err.message }));
});

module.exports = app;
