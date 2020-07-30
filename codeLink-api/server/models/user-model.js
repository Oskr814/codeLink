const moongose = require("mongoose");

let Schema = moongose.Schema;

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
  pre: { //Preregistro
    type: Boolean,
    default: true
  },
  plan: {
    type: String,
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
