const { genPassword, validPassword } = require("../lib/passwordUtils");
const db = require("../db/queries");

const getSignUp = (req, res) => {
  res.render("sign-up-form");
};

const postSignUp = async (req, res) => {
  const { username, password } = req.body;

  await db.createUser(username, password);

  res.redirect("/sign-up");
};

module.exports = {
  getSignUp,
  postSignUp,
};
