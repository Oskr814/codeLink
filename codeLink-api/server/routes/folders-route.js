const express = require("express");

const app = express();

const UserFolder = require("../models/user-model");

const verificarToken = require("../middlewares/auth");

app.post("/folder/:owner", (req, res) => {
  let owner = req.params.owner;

  let body = req.body;

  UserFolder.findOne({ _id: owner })
    .then((user) => {
      const folder = user.folders.find((folder) => {
        return folder.name == body.name && folder.status;
      });
      if (folder) {
        return res.status(422).json({
          ok: false,
          message: "El nombre de la carpeta debe ser unico",
        });
      }

      return UserFolder.findOneAndUpdate(
        { _id: owner },
        {
          $push: {
            folders: {
              name: body.name,
              parent: body.parent,
            },
          },
        },
        { new: true }
      );
    })
    .then((user) => res.json(user.folders.splice(-1)[0]))
    .catch((err) => res.status(500).json({ ok: false, err }));
});

app.get("/folders/:owner/:id?", (req, res) => {
  let owner = req.params.owner;

  let id = req.params.id;

  UserFolder.findOne({
    _id: owner,
  })
    .then((user) => {
      let folders = [];
      let projects = [];

      if (!id) {
        folders = user.folders.filter( folder => !folder.parent && folder.status);
        projects = user.projects;
      } else {
        const folder = user.folders.find((folder) => folder._id == id);
        folders = user.folders.filter((childFolder) => {
          
            return childFolder.status && childFolder.parent == folder._id;
          
        });
        projects = folder.projects;
      }

      res.json({ folders, projects });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ ok: false, err });
    });
});

app.put("/folder/:id", (req, res) => {
  let id = req.params.id;
  let body = req.body;

  if (!body.name) {
    return res
      .status(422)
      .json({ ok: false, message: "El nombre del proyecto es requerido" });
  }

  body.write_date = new Date().getTime();

  UserFolder.findOneAndUpdate(
    { folders: { $elemMatch: { _id: id } } },
    {
      $set: {
        "folders.$[i].name": body.name,
        "folders.$[i].write_date": body.write_date,
      },
    },
    { arrayFilters: [{ "i._id": id }], new: true }
  )
    .then((user) => {
      res.json({
        ok: true,
        folder: user.folders.find((folder) => folder._id == id),
      });
    })
    .catch((err) => {
      res.status(500).json({
        ok: false,
        err,
      });
    });
});

app.delete("/folder/:id", (req, res) => {
  let id = req.params.id;

  UserFolder.update(
    { folders: { $elemMatch: { _id: id } } },
    { $set: { "folders.$[i].status": false } },
    { arrayFilters: [{ "i._id": id }] }
  )
    .then((result) => {
      res.json({
        ok: true,
        result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        ok: false,
        err,
      });
    });
});

module.exports = app;
