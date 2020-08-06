const express = require("express");

const app = express();

const verificarToken = require("../middlewares/auth");

const UserProject = require("../models/user-model");

const {
  findUserProject,
  updateRoot,
  updateFolderProject,
} = require("../functions/projects");

app.post("/project/:owner", verificarToken, (req, res) => {
  let owner = req.params.owner;
  let body = req.body;

  UserProject.findOne({ _id: owner })
    .then((user) => {
      if (!body.folder) {
        return UserProject.findOneAndUpdate(
          { _id: owner },
          { $push: { projects: { name: body.name } } },
          { new: true }
        );
      }

      let folder = user.folders.find((folder) => folder._id == body.folder);

      if (!folder) {
        throw new Error('El folder especificado no existe');
      }

      if (folder.projects.length > 0) {
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
      if (!user) {
        throw new Error('El usuario proporcionado no existe');
      }

      if (!body.folder) {
        return res.json(user.projects.splice(-1)[0]);
      }
      let folder = user.folders.find((folder) => (folder._id = body.folder));

      res.json(folder.projects.splice(-1)[0]);
    })
    .catch((err) => res.status(500).json({ ok: false, err: err.message }));
});

app.get("/project/:owner/:id", verificarToken, (req, res) => {
  let owner = req.params.owner;
  let project_id = req.params.id;
  UserProject.findOne({ _id: owner })
    .then((user) => {
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const project = findUserProject(user, project_id);

      res.json(project.project);
    })
    .catch((err) => {
      res.status(500).json({ ok: false, err: err.message });
    });
});

app.put("/project/:owner/:id", verificarToken, (req, res) => {
  let owner = req.params.owner;
  let project_id = req.params.id;

  let body = req.body;

  body.write_date = new Date().getTime();

  UserProject.findOne({ _id: owner })
    .then((user) => {
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const { root, folder_id } = findUserProject(user, project_id);
      if (root) {
        return updateRoot(body, project_id);
      }

      return updateFolderProject(user._id, folder_id, body);
    })
    .then((user) => {
      const { project } = findUserProject(user, project_id);

      res.json(project);
    })
    .catch((err) => {
      res.status(500).json({ ok: false, err: err.message });
    });
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
