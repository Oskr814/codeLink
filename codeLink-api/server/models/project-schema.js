const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ProjectSchema = new Schema({
  name: {
    type: String,
    required: [true, "Debe ingresar el nombre"],
    unique: true
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
  code: {
    type: {},
    default: {
      html: "",
      css: "",
      js: "",
    },
  },
});

module.exports = ProjectSchema;
