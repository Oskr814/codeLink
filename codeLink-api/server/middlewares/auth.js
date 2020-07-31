const jwt = require("jsonwebtoken");

let verificarToken = (req, res, next) => {
  let token = req.get("token");

  if(token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  console.log(token);

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
