const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const upload = multer({ dest: "public/" });

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

const getFileForm = (req, res) => {
  res.render("file-form");
};

const postFileForm = (req, res) => {
  res.redirect("/");
};

module.exports = {
  getSignUp,
  postSignUp,
  getLogIn,
  getFileForm,
  postFileForm,
};
