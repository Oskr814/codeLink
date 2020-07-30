const moongose = require("mongoose");

let Schema = moongose.Schema;

const roles = ["ADMIN_ROLE", "USER_ROLE"];

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
  role: {
    type: String,
    default: "USER_ROLE",
    enum: roles,
  },
  plan: {
    type: String,
    required: [true, "El plan es requerido"],
  },
  status: {
      type: Boolean,
      default: true
  }
});

userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

module.exports = moongose.model("user", userSchema);
