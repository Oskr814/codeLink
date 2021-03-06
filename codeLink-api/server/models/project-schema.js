const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ProjectSchema = new Schema({
  name: {
    type: String,
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
