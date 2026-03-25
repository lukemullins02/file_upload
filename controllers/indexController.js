const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const upload = multer({ dest: "public/" });

const getHome = async (req, res) => {
  const folders = await db.getFolders();

  res.render("home", {
    folders: folders,
  });
};

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

const getFolderForm = (req, res) => {
  res.render("folder-form");
};

const postFolderForm = async (req, res) => {
  const { name } = req.body;

  console.log(name, req.user.id);

  await db.createFolder(name, req.user.id);
};

module.exports = {
  getHome,
  getSignUp,
  postSignUp,
  getLogIn,
  getFileForm,
  postFileForm,
  getFolderForm,
  postFolderForm,
};
