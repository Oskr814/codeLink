const mongoose = require("mongoose");

const FolderSchema = require("./folder-schema");
const ProjectSchema = require("./project-schema");
const SnippetSchema = require("./snippet-schema");

let Schema = mongoose.Schema;

let userSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es necesario"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es necesario"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  img: {
    type: String,
  },
  pre: {
    //Preregistro
    type: Boolean,
    default: true,
  },
  plan: {
    type: String,
  },
  creditCard: {
    type: Object,
    default: {},
  },
  paymentMethod: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
  folders: [FolderSchema],
  projects: [ProjectSchema],
  snippets: [SnippetSchema],
});

userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  delete userObject.password;
  delete userObject.creditCard;

  return userObject;
};

userSchema.post("save", function (error, res, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("El correo electronico ya esta en uso"));
  } else {
    next();
  }
});

module.exports = mongoose.model("user", userSchema);
