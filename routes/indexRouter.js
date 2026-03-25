const { Router } = require("express");
const passport = require("passport");
const { isAuth, loggedIn } = require("../controllers/authController");
const {
  getSignUp,
  postSignUp,
  getLogIn,
  getFileForm,
  postFileForm,
  getHome,
  getFolderForm,
  postFolderForm,
  getFolder,
  getFolderUpdate,
  postFolderUpdate,
  getDeleteFolder,
} = require("../controllers/indexController");
const multer = require("multer");
const upload = multer({ dest: "./public/" });

const indexRouter = Router();

indexRouter.get("/", isAuth, getHome);

indexRouter.get("/sign-up", loggedIn, getSignUp);

indexRouter.post("/sign-up", postSignUp);

indexRouter.get("/login", loggedIn, getLogIn);

indexRouter.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
    successRedirect: "/",
  }),
);

indexRouter.get("/folder/:id/file-upload", isAuth, getFileForm);

indexRouter.post(
  "/folder/:id/file-upload",
  upload.single("file"),
  postFileForm,
);

indexRouter.get("/folder/:id", isAuth, getFolder);

indexRouter.get("/create-folder", isAuth, getFolderForm);

indexRouter.post("/create-folder", postFolderForm);

indexRouter.get("/folder/:id/update", isAuth, getFolderUpdate);

indexRouter.post("/folder/:id/update", postFolderUpdate);

indexRouter.get("/folder/:id/delete", getDeleteFolder);

module.exports = indexRouter;
