const express = require("express");

const app = express();

const verificarToken = require("../middlewares/auth");

const UserProject = require("../models/user-model");

const {
  findUserSnippet,
  updateRoot,
  updateFolderSnippet,
  checkIfNameExists,
} = require("../functions/snippets");

app.post("/snippet/:owner", verificarToken, (req, res) => {
  let owner = req.params.owner;
  let body = req.body;

  UserProject.findOne({ _id: owner })
    .then((user) => {
      if (!body.folder) {
        checkIfNameExists(body.snippet.name, user.snippets); //throw exception

        return UserProject.findOneAndUpdate(
          { _id: owner },
          {
            $push: {
              snippets: {
                name: body.snippet.name,
                code: body.snippet.code,
                language: body.snippet.language,
              },
            },
          },
          { new: true }
        );
      }

      let folder = user.folders.find((folder) => folder._id == body.folder);

      if (!folder) {
        throw new Error("El folder especificado no existe");
      }

      checkIfNameExists(body.snippet.name, folder.snippets); //throw exception

      return UserProject.findOneAndUpdate(
        { _id: owner },
        {
          $push: {
            "folders.$[i].snippets": {
              name: body.snippet.name,
              code: body.snippet.code,
              language: body.snippet.language,
            },
          },
        },
        { arrayFilters: [{ "i._id": folder._id }], new: true }
      );
    })
    .then((user) => {
      if (!user) {
        throw new Error("El usuario proporcionado no existe");
      }

      if (!body.folder) {
        return res.json(user.snippets.splice(-1)[0]);
      }
      let folder = user.folders.find((folder) => folder._id == body.folder);

      res.json(folder.snippets.splice(-1)[0]);
    })
    .catch((err) => res.status(500).json({ ok: false, message: err.message }));
});

app.get("/snippet/:owner/:id", verificarToken, (req, res) => {
  let owner = req.params.owner;
  let snippet_id = req.params.id;
  UserProject.findOne({ _id: owner })
    .then((user) => {
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const { snippet } = findUserSnippet(user, snippet_id);

      res.json(snippet);
    })
    .catch((err) => res.status(500).json({ ok: false, message: err.message }));
});

app.put("/snippet/:owner/:id", verificarToken, (req, res) => {
  let owner = req.params.owner;
  let snippet_id = req.params.id;

  let body = req.body;

  body.write_date = new Date().getTime();

  UserProject.findOne({ _id: owner })
    .then((user) => {
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const { root, folder_id } = findUserSnippet(user, snippet_id);
      if (root) {
        checkIfNameExists(body.name, user.snippets, snippet_id); //Raise exception

        return updateRoot(body, snippet_id);
      }

      const folder = user.folders.find((folder) => folder.id == folder_id);

      checkIfNameExists(body.name, folder.snippets, snippet_id); // Raise exception

      return updateFolderSnippet(user._id, folder_id, body);
    })
    .then((user) => {
      const { snippet } = findUserSnippet(user, snippet_id);

      res.json(snippet);
    })
    .catch((err) => res.status(500).json({ ok: false, message: err.message }));
});

app.delete("/snippet/:owner/:id", verificarToken, (req, res) => {
  let owner = req.params.owner;
  let snippet_id = req.params.id;

  UserProject.findOne({ _id: owner })
    .then((user) => {
      if (!user) {
        throw new Error("Usuario no valido");
      }

      const { root, folder_id } = findUserSnippet(user, snippet_id);

      if (root) {
        return UserProject.update(
          { _id: owner },
          {
            $pull: {
              snippets: { _id: snippet_id },
            },
          }
        );
      }

      return UserProject.update(
        { _id: owner },
        {
          $pull: {
            "folders.$[i].snippets": { _id: snippet_id },
          },
        },
        { arrayFilters: [{ "i._id": folder_id }] }
      );
    })
    .then((result) => {
      if (!result.nModified) {
        return res
          .status(422)
          .json({ ok: false, message: "No se pudo eliminar el proyecto" });
      }

      res.json({
        ok: true,
        result,
      });
    })
    .catch((err) => res.status(500).json({ ok: false, message: err.message }));
});

module.exports = app;
