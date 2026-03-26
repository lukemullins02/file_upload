const { Router } = require("express");
const passport = require("passport");
const { isAuth, loggedIn } = require("../controllers/authController");
const { cloud_storage } = require("../config/cloudinary");
const {
  getSignUp,
  postSignUp,
  getLogIn,
  postFileForm,
  getHome,
  getFolderForm,
  postFolderForm,
  getFolder,
  getFolderUpdate,
  postFolderUpdate,
  getDeleteFolder,
  getFilePage,
  getFileDownload,
} = require("../controllers/indexController");
const multer = require("multer");
const upload = multer({ storage: cloud_storage });

const indexRouter = Router();

indexRouter.get("/", isAuth, getHome);

indexRouter.get("/sign-up", loggedIn, getSignUp);

indexRouter.post("/sign-up", loggedIn, postSignUp);

indexRouter.get("/login", loggedIn, getLogIn);

indexRouter.post(
  "/login",
  loggedIn,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
    successRedirect: "/",
  }),
);

indexRouter.get("/logout", isAuth, (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

indexRouter.post("/folder/:id", isAuth, upload.single("file"), postFileForm);

indexRouter.get("/folder/:id", isAuth, getFolder);

indexRouter.get("/create-folder", isAuth, getFolderForm);

indexRouter.post("/create-folder", isAuth, postFolderForm);

indexRouter.get("/folder/:id/update", isAuth, getFolderUpdate);

indexRouter.post("/folder/:id/update", isAuth, postFolderUpdate);

indexRouter.get("/folder/:id/delete", isAuth, getDeleteFolder);

indexRouter.get("/folder/:id/file/:file_id", isAuth, getFilePage);

indexRouter.get("/folder/:id/file/:file_id/download", isAuth, getFileDownload);

module.exports = indexRouter;
