const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let recentProject = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  project_id: {
    type: String,
    required: true,
  },
  write_date: {
    type: Number,
    default: new Date().getTime(),
  },
});

module.exports = mongoose.model("recentprojects", recentProject);
