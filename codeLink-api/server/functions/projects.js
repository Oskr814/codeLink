const UserProject = require("../models/user-model");
const RecentProject = require("../models/recent-project-model");

// Obtener el proyecto solicitado
let findUserProject = function (user, project_id) {
  let project;
  //root
  project = user.projects.find((project) => project._id == project_id);

  if (project) {
    return { project, root: true, folder_id: null };
  }

  //subdirectories
  for (const folder of user.folders) {
    project = folder.projects.find((project) => project._id == project_id);

    if (project) {
      return { project, root: false, folder_id: folder._id };
    }
  }

  throw new Error("El proyecto especificado no existe");
};

// Actualizar proyecto que se encuentra en la razi
let updateRoot = function (project, project_id) {
  return UserProject.findOneAndUpdate(
    { projects: { $elemMatch: { _id: project_id } } },
    {
      $set: {
        "projects.$[i].name": project.name,
        "projects.$[i].write_date": project.write_date,
        "projects.$[i].html": project.html,
        "projects.$[i].css": project.css,
        "projects.$[i].js": project.js,
      },
    },
    { arrayFilters: [{ "i._id": project_id }], new: true }
  );
};

//Actualizar proyecto que se encuntra dentro de una carpeta
let updateFolderProject = function (user_id, folder_id, project) {
  return UserProject.findOneAndUpdate(
    { _id: user_id },
    {
      $set: {
        "folders.$[i].projects.$[j].name": project.name,
        "folders.$[i].projects.$[j].write_date": project.write_date,
        "folders.$[i].projects.$[j].html": project.html,
        "folders.$[i].projects.$[j].css": project.css,
        "folders.$[i].projects.$[j].js": project.js,
      },
    },
    {
      arrayFilters: [{ "i._id": folder_id }, { "j._id": project._id }],
      new: true,
    }
  );
};

let checkIfNameExists = function (name, projects, project_id) {
  if (project_id) {
    projects = projects.filter((project) => project._id != project_id);
  }

  if (projects && projects.length > 0) {
    let project = projects.find(
      (project) => project.name == name && project.status
    );

    if (!!project)
      throw new Error("El nombre proporcionado se encuentra en uso");
  }
};

let setRecentProject = function (owner, project) {
  RecentProject.findOne({ project_id: project._id })
    .then((recentProject) => {
      if (recentProject) {
        recentProject.write_date = new Date().getTime();
        recentProject.name = project.name;

        return recentProject.save();
      }

      return new RecentProject({
        name: project.name,
        project_id: project._id,
        owner,
      }).save();
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

module.exports = {
  findUserProject,
  updateRoot,
  updateFolderProject,
  checkIfNameExists,
  setRecentProject,
};
