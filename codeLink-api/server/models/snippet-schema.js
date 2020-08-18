const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let SnippetSchema = new Schema({
  name: {
    type: String,
    required: [true, "Debe ingresar el nombre"]
  },
  code: {
    type: String,
    required: true
  },
  language: {
      type: String,
      required: true
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
  }
});

module.exports = SnippetSchema;
