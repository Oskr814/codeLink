const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ProjectSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Debe ingresar el nombre"]
  },
  create_date: {
    type: Number,
    default: new Date().getTime(),
  },
  write_date: {
    type: Number,
    default: new Date().getTime(),
  },
  status: {
    type: Boolean,
    default: true,
  },
  snippets: {
    type: Array,
    default: [],
  },
  html: {
    type: String,
    default: ""
  },
  css: {
    type: String,
    default: ""
  },
  js: {
    type: String,
    default: ""
  }
});

module.exports = ProjectSchema;
