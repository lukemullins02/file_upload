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

indexRouter.get("/file-upload", getFileForm);
indexRouter.post("/file-upload", upload.single("file"), postFileForm);

module.exports = indexRouter;
