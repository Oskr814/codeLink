const express = require("express");

const app = express();

const verificarToken = require('../middlewares/auth');

const UserProject = require("../models/user-model");

app.post("/project/:owner", verificarToken, (req, res) => {
  let owner = req.params.owner;
  let body = req.body;

  UserProject.findOne({ _id: owner })
    .then((user) => {
      let folder = user.folders.find((folder) => (folder._id = body.folder));

      if (!folder) {
        return res.status(422).json({
          ok: false,
          message: "El folder especificado no existe",
        });
      }

      if (folder.projects.length > 0) {
        console.log("re");
        let project = folder.projects.find(
          (project) => project.status && project.name == body.name
        );

        if (project) {
          return res.status(422).json({
            ok: false,
            message: "El nombre del proyecto debe ser unico",
          });
        }
      }

      return UserProject.findOneAndUpdate(
        { _id: owner },
        { $push: { "folders.$[i].projects": { name: body.name } } },
        { arrayFilters: [{ "i._id": folder._id }], new: true }
      );
    })
    .then((user) => {
      let folder = user.folders.find((folder) => (folder._id = body.folder));

      res.json({ ok: true, project: folder.projects.splice(-1)[0] });
    })
    .catch((err) => console.log(err));
});


app.get("/project/:owner", verificarToken, (req, res) => {
  let owner = req.params.owner;

  let body = req.body;

  UserProject.findOne({ _id: owner })
    .then((user) => {
      let folder = user.folders.find((folder) => folder._id == body.folder);

      if (!folder) {
        return res
          .status(422)
          .json({ ok: false, message: "No se encontro la carpeta" });
      }

      folder.projects = folder.projects.filter((project) => project.status);

      res.json({ ok: true, projects: folder.projects });
    })
    .catch((err) => res.status(500).json({ ok: false, err }));
});

app.put("/project/:id", verificarToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  if (!body.name) {
    return res
      .status(422)
      .json({ ok: false, message: "El nombre del proyecto es requerido" });
  }

  body.write_date = new Date().getTime();

  UserProject.findOneAndUpdate(
    { folders: { $elemMatch: { _id: body.folder } } },
    {
      $set: {
        "folders.$[i].projects.$[j].name": body.name,
        "folders.$[i].projects.$[j].write_date": body.write_date,
      },
    },
    { arrayFilters: [{ "i._id": body.folder }, { "j._id": id }], new: true }
  )
    .then((user) => {
      let folder = user.folders.find((folder) => folder._id == body.folder);

      res.json({
        ok: true,
        project: folder.projects.find((project) => project._id == id),
      });
    })
    .catch((err) => res.status(500).json({ ok: false, err }));
});


app.delete("/project/:id", verificarToken, (req, res) => {
  let id = req.params.id;

  let body = req.body;

  UserProject.update(
    {
      folders: { $elemMatch: { _id: body.folder } },
    },
    {
      $set: {
        "folders.$[i].projects.$[j].status": false,
      },
    },
    { arrayFilters: [{ "i._id": body.folder }, { "j._id": id }] }
  )
    .then((result) => res.json({ ok: true, result }))
    .catch((err) => res.status(500).json({ ok: false, err }));
});

module.exports = app;
