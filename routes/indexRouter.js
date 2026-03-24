const { Router } = require("express");
const passport = require("passport");
const { isAuth, loggedIn } = require("../controllers/authController");
const {
  getSignUp,
  postSignUp,
  getLogIn,
  postLogIn,
} = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", isAuth, (req, res) => {
  res.send("Logged In!!!");
});

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

module.exports = indexRouter;
