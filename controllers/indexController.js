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
  res.render("forms/file-form", {
    id: req.params.id,
  });
};

const postFileForm = async (req, res) => {
  const { originalname, size } = req.file;

  await db.createFile(originalname, size, req.user.id, req.params.id);

  res.redirect("/");
};

const getFolderForm = (req, res) => {
  res.render("forms/folder-form");
};

const postFolderForm = async (req, res) => {
  const { name } = req.body;
  await db.createFolder(name, req.user.id);
  res.redirect("/");
};

const getFolder = async (req, res) => {
  const folder = await db.getFolder(req.params.id);
  const files = await db.getFiles(req.user.id, req.params.id);

  console.log(folder);
  res.render("folder", {
    folder: folder,
    files: files,
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

  await db.updateFolder(req.params.id, name);

  res.redirect(`/folder/${req.params.id}`);
};

const getDeleteFolder = async (req, res) => {
  await db.deleteFolder(req.params.id);
  res.redirect("/");
};

const getFilePage = async (req, res) => {
  const file = await db.getFile(req.params.file_id);
  res.render("file", {
    file: file,
  });
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
  getDeleteFolder,
  getFilePage,
};
