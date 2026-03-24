const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const getSignUp = (req, res) => {
  res.render("sign-up-form");
};

const postSignUp = async (req, res) => {
  const { username, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);

  await db.createUser(username, hashPassword);

  res.redirect("/sign-up");
};

const getLogIn = (req, res) => {
  res.render("login-form");
};

module.exports = {
  getSignUp,
  postSignUp,
  getLogIn,
};
