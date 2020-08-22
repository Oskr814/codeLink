const express = require("express");

const app = express();

const UserFolder = require("../models/user-model");
const RecentProject = require("../models/recent-project-model");

const verificarToken = require("../middlewares/auth");

app.post("/folder/:owner", (req, res) => {
  let owner = req.params.owner;

  let body = req.body;

  UserFolder.findOne({ _id: owner })
    .then(async (user) => {
      const folder = user.folders.find((folder) => {
        return folder.name === body.name && folder.parent === body.parent;
      });

      if (folder) {
        const parentFolder = await UserFolder.findOne({
          "folders._id": folder.parent,
        });

        if (parentFolder) {
          return res.status(422).json({
            ok: false,
            message: "El nombre de la carpeta ya esta en uso",
          });
        } else {
          //Eliminar folder
          await UserFolder.update(
            { _id: owner },
            { $pull: { folders: { _id: folder._id } } }
          );
        }
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
    .catch((err) => res.status(500).json({ ok: false, message: err.message }));
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
      let snippets = [];

      if (!id) {
        folders = user.folders.filter(
          (folder) => !folder.parent && folder.status
        );
        projects = user.projects;
        snippets = user.snippets;
      } else {
        const folder = user.folders.find((folder) => folder._id == id);
        folders = user.folders.filter((childFolder) => {
          return childFolder.status && childFolder.parent == folder._id;
        });
        projects = folder.projects;
        snippets = folder.snippets;
      }

      res.json({ folders, projects, snippets });
    })
    .catch((err) => res.status(500).json({ ok: false, message: err.message }));
});

app.put("/folder/:owner/:id", (req, res) => {
  let owner = req.params.owner;
  let id = req.params.id;
  let body = req.body;

  if (!body.name) {
    return res
      .status(422)
      .json({ ok: false, message: "El nombre del proyecto es requerido" });
  }

  body.write_date = new Date().getTime();

  UserFolder.findOne({ _id: owner })
    .then((user) => {
      const folder = user.folders.find((folder) => {
        return folder.name == body.name && folder.status;
      });

      if (folder) {
        return res.status(422).json({
          ok: false,
          message: "El nombre de la carpeta ya esta en uso",
        });
      }
      return UserFolder.findOneAndUpdate(
        { _id: owner, folders: { $elemMatch: { _id: id } } },
        {
          $set: {
            "folders.$[i].name": body.name,
            "folders.$[i].write_date": body.write_date,
          },
        },
        { arrayFilters: [{ "i._id": id }], new: true }
      );
    })
    .then((user) => res.json(user.folders.find((folder) => folder._id == id)))
    .catch((err) => res.status(500).json({ ok: false, message: err.message }));
});

app.delete("/folder/:owner/:id", async (req, res) => {
  let owner = req.params.owner;
  let id = req.params.id;

  const user = await UserFolder.findOne({ _id: owner });

  //Eliminar hijos
  let parent = id;
  for (const folder of user.folders) {
    //Eliminar proyecto reciente
    for (const project of folder.projects) {
      await RecentProject.deleteOne({ project_id: project._id });
    }
    if (folder.parent == parent) {
      await UserFolder.update(
        { _id: owner },
        { $pull: { folders: { _id: folder._id } } }
      );

      parent = folder._id;
    }
  }

  //Eliminar padre

  UserFolder.update({ _id: owner }, { $pull: { folders: { _id: id } } })
    .then((result) => {
      if (!result.nModified) {
        return res
          .status(422)
          .json({ ok: false, message: "No se pudo eliminar la carpeta" });
      }

      res.json({
        ok: true,
        result,
      });
    })
    .catch((err) => res.status(500).json({ ok: false, message: err.message }));
});

module.exports = app;
