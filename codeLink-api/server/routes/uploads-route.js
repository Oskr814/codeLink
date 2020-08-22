const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const User = require("../models/user-model");

app.use(fileUpload());

app.put("/upload/images/user-profile/:user_id", function (req, res) {
  const user_id = req.params.user_id;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res
      .status(400)
      .json({ message: "No se ha seleccionado ningun archivo" });
  }

  let image = req.files.image;

  let fileExtension = image.name.split(".").splice(-1)[0];

  if (!image.mimetype.match(/image\/*/)) {
    res.status(400).json({
      ok: false,
      message: "Archivo no valido, debe ser imagen: " + types.join(", "),
    });
  }

  const fileName = `${user_id}-${new Date().getMilliseconds()}.${fileExtension}`;
  image.mv(`uploads/${fileName}`, (err) => {
    if (err) return res.status(500).json({ ok: false, err: err.message });

    User.findOne({ _id: user_id })
      .then((user) => {
        if (!user) {
          return res.status(400).json({
            ok: false,
            message: "Usuario o contraseña incorrecto",
          });
        }

        const resourcePath = `${req.protocol}://${req.get("host")}/img`;

        if (user.img) {
          const imgPath = path.resolve(
            __dirname,
            `../../uploads/${user.img.replace(`${resourcePath}/`, "")}`
          );

          if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
          }
        }

        user.img = `${resourcePath}/${fileName}`;

        return User.findOneAndUpdate(
          { _id: user._id },
          { img: user.img },
          { new: true }
        );
      })
      .then((user) => {
        const userData = {
          _id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          creditCard: user.creditCard,
          status: user.status,
          pre: user.pre,
          paymentMethod: user.paymentMethod,
          creditCard: user.creditCard,
          img: user.img,
        };

        let token = jwt.sign({ data: userData }, process.env.SEED, {
          expiresIn: process.env.JWTEXP,
        });

        res.json(token);
      })
      .catch((err) =>
        res.status(500).json({ ok: false, message: err.message })
      );
  });
});

module.exports = app;
