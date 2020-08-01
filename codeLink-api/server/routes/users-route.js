const express = require("express");
const bcrypt = require("bcrypt");

const app = express();
const jwt = require("jsonwebtoken");

const User = require("../models/user-model");
const verificarToken = require("../middlewares/auth");

//CREATE
app.post("/user", (req, res) => {
  let body = req.body;

  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
    plan: body.plan,
  });

  user
    .save()
    .then((user) => res.json({ ok: true, user }))
    .catch((err) => res.status(500).json({ ok: false, err }));
});
//READ
app.get("/user", verificarToken, (req, res) => {
  User.find({ status: true })
    .then((users) => res.json({ ok: true, users }))
    .catch((err) => res.status(500).json({ ok: false, err }));
});

app.put("/user/:id", verificarToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  //Eliminar posibles campos que no se deberian actualizar de esta manera
  delete body.password;
  delete body.email;

  User.findOneAndUpdate({ _id: id }, body, { runValidators: true, new: true })
    .then((user) => {
      const token = jwt.sign({ data: user }, process.env.SEED, {
        expiresIn: process.env.JWTEXP,
      });

      res.json({
        ok: true,
        token,
      });
    })
    .catch((err) => res.status(500).json({ ok: false, err }));
});

app.delete("/user/:id", verificarToken, (req, res) => {
  let id = req.params.id;

  User.update({ _id: id }, { status: false })
    .then((result) => res.json({ ok: true, result }))
    .catch((err) => res.status(500).json({ ok: false, err }));
});

module.exports = app;
