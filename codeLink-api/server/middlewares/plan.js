const User = require("../models/user-model");

const plans = [
  {
    code: "basico",
    limit: 5,
  },
  {
    code: "estandar",
    limit: 2,
  },
  {
    code: "premium",
    limit: 0,
  },
];

let checkPlan = (req, res, next) => {
  const owner = req.params.owner;

  User.findOne({ _id: owner })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ ok: false, message: "Usuario no valido" });
      }

      let total = 0;

      total += user.projects.length;

      for (const folder in user.folders) {
        if (folder.projects) {
          total += folder.projects.length;
        }
      }

      const plan = plans.find((plan) => plan.code == user.plan);

      if (total >= plan.limit) {
        return res
          .status(422)
          .json({ ok: false, message: "Limite de proyectos alcanzado" });
      }

      next();
    })
    .catch((err) => res.status(500).json({ ok: false, message: err.message }));
};

module.exports = checkPlan;
