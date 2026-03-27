const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { cloud_storage } = require("../config/cloudinary");
const upload = multer({
  storage: cloud_storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("file");

const { body, validationResult, matchedData } = require("express-validator");

const spaceErr = "must have no spaces.";
const userLengthErr =
  "must be more than 3 characters and less than 16 characters.";
const passwordLengthErr = " must be at least 8 characters long.";
const mismatchErr =
  " must contain at least one uppercase letter, one lowercase letter, one number, and one symbol.";
const passwordErr = "Passwords don't match.";
const folderErr = "must be between 1 and 18 characters.";

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

const validateFolder = [
  body("name").isLength({ min: 1, max: 18 }).withMessage(`Folder ${folderErr}`),
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
  const errorMessages = req.session.messages || [];
  req.session.messages = [];

  const lastMessage = errorMessages.length
    ? [errorMessages[errorMessages.length - 1]]
    : [];

  if (!req.user) {
    res.render("forms/login-form", { messages: lastMessage });
  } else {
    res.redirect("/");
  }
};

const postFileCloud = async (req, res, next) => {
  const files = await db.getFiles(req.user.id, req.params.id);

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).render("folder", {
          errors: [{ msg: "File too large. Max 5MB." }],
          folder: { id: req.params.id },
          files: files,
        });
      }
    } else if (err) {
      return res.status(400).render("folder", {
        errors: [{ msg: "Only jpeg, jpg, gif, png, and pdf files allowed." }],
        folder: { id: req.params.id },
        files: files,
      });
    }

    next();
  });
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

const postFolderForm = [
  validateFolder,
  async (req, res) => {
    const errors = validationResult(req).array();

    if (errors.length != 0) {
      return res.status(400).render("forms/folder-form", {
        errors: errors,
      });
    }

    const { name } = matchedData(req);
    await db.createFolder(name, req.user.id);
    res.redirect("/");
  },
];

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
  const files = await db.getFiles(req.user.id, req.params.id);

  for (let i = 0; i < files.length; i++) {
    await cloudinary.uploader
      .destroy(files[i].publicId)
      .then((result) => console.log(result))
      .catch((err) => {
        console.error(err);
      });
  }

  await db.deleteFolder(req.params.id);

  res.redirect("/");
};

const getFilePage = async (req, res) => {
  const file = await db.getFile(req.params.file_id);

  file.uploadAt = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(file.uploadAt);

  res.render("file", {
    file: file,
  });
};

const getFileDownload = async (req, res) => {
  const file = await db.getFile(req.params.file_id);
  const url = cloudinary.utils.cloudinary_url(file.publicId, {
    flags: "attachment",
  })[0];
  res.redirect(url);
};

module.exports = {
  getHome,
  getSignUp,
  postSignUp,
  getLogIn,
  postFileCloud,
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
