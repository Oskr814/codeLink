const express = require("express");
const bcrypt = require("bcrypt");

const app = express();

const Usuario = require("../models/user-model");

//CREATE
app.post("/user", (req, res) => {
  let newUser = req.body;

  let user = new Usuario({
    name: newUser.name,
    email: newUser.email,
    password: bcrypt.hashSync(newUser.password, 10),
    role: newUser.role,
    plan: newUser.plan,
  });

  user.save((err, user) => {
    if (err) {
      return res.status(422).json({
        ok: false,
        err,
      });
    }

    return res.status(200).json({
      ok: true,
      user,
    });
  });
});
//READ
app.get("/user", (req, res) => {
  Usuario.find({status: true})
    .then((users) => {
      res.status(200).json({
          ok: true,
          users
      });
    })
    .catch((err) => {
      res.status(422).json({
        ok: false,
        err,
      });
    });
});

app.put("/user/:id", (req, res) => {
  let id = req.params.id;
  let user = req.body;

  //Eliminar posibles campos que no se deberian actualizar de esta manera
  delete user.password;
  delete user.plan;
  delete user.email;

  Usuario.update({ _id: id }, user, { runValidators: true })
    .then((result) => {
      res.status(200).json({
        ok: true,
        result,
      });
    })
    .catch((err) => {
      res.status(422).json({
        ok: false,
        err,
      });
    });
});

app.delete("/user/:id", (req, res) => {
    let id = req.params.id;

    Usuario.update({_id: id}, {status: false})
    .then( result => {
        res.status(200).json({
            ok: true,
            result
        })
    })
    .catch( err => {
        res.status(422).json({
            ok: false,
            err
        })
    })
});

module.exports = app;
