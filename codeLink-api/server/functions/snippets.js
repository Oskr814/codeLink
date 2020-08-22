const UserProject = require("../models/user-model");

// Obtener el proyecto solicitado
let findUserSnippet = function (user, snippet_id) {
  let snippet;
  //root
  snippet = user.snippets.find((snippet) => snippet._id == snippet_id);

  if (snippet) {
    return { snippet, root: true, folder_id: null };
  }

  //subdirectories
  for (const folder of user.folders) {
    snippet = folder.snippets.find((snippet) => snippet._id == snippet_id);

    if (snippet) {
      return { snippet, root: false, folder_id: folder._id };
    }
  }

  throw new Error("El snippet especificado no existe");
};

// Actualizar snippet que se encuentra en la raiz
let updateRoot = function (snippet, snippet_id) {
  return UserProject.findOneAndUpdate(
    { snippets: { $elemMatch: { _id: snippet_id } } },
    {
      $set: {
        "snippets.$[i].name": snippet.name,
        "snippets.$[i].language": snippet.language,
        "snippets.$[i].code": snippet.code,
        "snippets.$[i].write_date": snippet.write_date,
      },
    },
    { arrayFilters: [{ "i._id": snippet_id }], new: true }
  );
};

//Actualizar snippet que se encuntra dentro de una carpeta
let updateFolderSnippet = function (user_id, folder_id, snippet) {
  return UserProject.findOneAndUpdate(
    { _id: user_id },
    {
      $set: {
        "folders.$[i].snippets.$[j].name": snippet.name,
        "folders.$[i].snippets.$[j].code": snippet.code,
        "folders.$[i].snippets.$[j].language": snippet.language,
        "folders.$[i].snippets.$[j].write_date": snippet.write_date,
      },
    },
    {
      arrayFilters: [{ "i._id": folder_id }, { "j._id": snippet._id }],
      new: true,
    }
  );
};

let checkIfNameExists = function (name, snippets, snippet_id) {
  if (snippet_id) {
    snippets = snippets.filter((snippet) => snippet._id != snippet_id);
  }

  if (snippets && snippets.length > 0) {
    let snippet = snippets.find(
      (snippet) => snippet.name == name && snippet.status
    );

    if (!!snippet)
      throw new Error("El nombre proporcionado se encuentra en uso");
  }
};

module.exports = {
  findUserSnippet,
  updateRoot,
  updateFolderSnippet,
  checkIfNameExists
};
