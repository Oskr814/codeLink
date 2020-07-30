const jwt = require("jsonwebtoken");

let verificarToken = (req, res, next) => {
  const token = req.get("token");

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        message: "Token no valido",
      });
    }

    req.user = decoded.user;
    next();
  });
};

module.exports = verificarToken;
