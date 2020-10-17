const jwt = require("jsonwebtoken");

module.exports = (app) => {
  app.post("/login", (req, res) => {
    const user = {
      username: req.body.username,
      email: req.body.username,
    };

    jwt.sign({ user: user }, "sKey", (err, token) => {
      if (err) throw err;
      if (!user.username) {
        res.status(400).send({ error: "No valid username" });
        console.log("Token creation failed.");
      } else {
        res.json({
          token,
        });
        console.log("Token created.");
      }
    });
  });
};
