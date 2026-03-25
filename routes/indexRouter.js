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

indexRouter.get("/file-upload", isAuth, getFileForm);

indexRouter.post("/file-upload", upload.single("file"), postFileForm);

indexRouter.get("/folder/:id", (req, res) => {
  res.send("Hello!");
});

indexRouter.get("/create-folder", isAuth, getFolderForm);

indexRouter.post("/create-folder", isAuth, postFolderForm);

module.exports = indexRouter;
