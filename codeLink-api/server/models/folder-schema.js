const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProjectSchema = require("./project-schema");

let FolderSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre de la carpeta es requerido"],
  },
  create_date: {
    type: Number,
    default: new Date().getTime(),
  },
  write_date: {
    type: Number,
    default: new Date().getTime(),
  },
  parent: {
    type: String,
    default: null,
  },
  status: {
    type: Boolean,
    default: true,
  },
  projects: [ProjectSchema],
});

module.exports = FolderSchema;
