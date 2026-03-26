const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const { body, validationResult, matchedData } = require("express-validator");

const spaceErr = "must have no spaces.";
const userLengthErr =
  "must be more than 3 characters and less than 16 characters.";
const passwordLengthErr = " must be at least 8 characters long.";
const mismatchErr =
  " must contain at least one uppercase letter, one lowercase letter, one number, and one symbol.";
const passwordErr = "Passwords don't match.";

const validateNewUser = [
  body("username")
    .custom((value) => !/\s/.test(value))
    .withMessage(`Useername ${spaceErr}`)
    .isLength({ min: 4, max: 15 })
    .withMessage(`Username ${userLengthErr}`),
  body("password")
    .isLength({ min: 8 })
    .withMessage(`Password ${passwordLengthErr}`)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).*$/)
    .withMessage(`Password ${mismatchErr}`),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(`${passwordErr}`),
];

const getHome = async (req, res) => {
  const folders = await db.getFolders(req.user.id);

  res.render("home", {
    folders: folders,
  });
};

const getSignUp = (req, res) => {
  res.render("forms/sign-up-form");
};

const postSignUp = [
  validateNewUser,
  async (req, res) => {
    const errors = validationResult(req).array();

    if (errors.length != 0) {
      return res.status(400).render("forms/sign-up-form", {
        errors: errors,
      });
    }

    const { username, password } = matchedData(req);

    const userExist = await db.getUser(username);

    if (userExist) {
      errors.push({ msg: "Username already registered. Try again." });
      return res.status(400).render("forms/sign-up-form", {
        errors: errors,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await db.createUser(username, hashPassword);

    res.redirect("/login");
  },
];

const getLogIn = (req, res) => {
  res.render("forms/login-form");
};

const postFileForm = async (req, res) => {
  const { originalname, size, filename, path } = req.file;

  await db.createFile(
    originalname,
    size,
    req.user.id,
    req.params.id,
    filename,
    path,
  );

  res.redirect(`/folder/${req.params.id}`);
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

const getFileDownload = async (req, res) => {
  const file = await db.getFile(req.params.file_id);

  const url = cloudinary.url(file.publicId, {
    flags: "attachment",
  });

  res.redirect(url);
};

module.exports = {
  getHome,
  getSignUp,
  postSignUp,
  getLogIn,
  postFileForm,
  getFolderForm,
  postFolderForm,
  getFolder,
  getFolderUpdate,
  postFolderUpdate,
  getDeleteFolder,
  getFilePage,
  getFileDownload,
};
