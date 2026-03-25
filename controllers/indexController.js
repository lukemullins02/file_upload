const db = require("../db/queries");
const bcrypt = require("bcryptjs");

const getHome = async (req, res) => {
  const folders = await db.getFolders(req.user.id);

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

  res.redirect("forms/sign-up");
};

const getLogIn = (req, res) => {
  res.render("forms/login-form");
};

const getFileForm = (req, res) => {
  res.render("forms/file-form");
};

const postFileForm = (req, res) => {
  res.redirect("/");
};

const getFolderForm = (req, res) => {
  res.render("forms/folder-form");
};

const postFolderForm = async (req, res) => {
  const { name } = req.body;
  await db.createFolder(name, req.user.id);
};

const getFolder = async (req, res) => {
  const folder = await db.getFolder(req.params.id);
  console.log(folder);
  res.render("folder", {
    folder: folder,
  });
};

const getFolderUpdate = async (req, res) => {
  const folder = await db.getFolder(req.params.id);
  res.render("updates/folder-update", {
    folder: folder,
  });
};

const postFolderUpdate = async (req, res) => {
  const { name } = req.body;

  db.updateFolder(req.params.id, name);

  res.redirect(`/folder/${req.params.id}`);
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
  getFolder,
  getFolderUpdate,
  postFolderUpdate,
};
