const { Router } = require("express");
const passport = require("passport");

const indexRouter = Router();

const {
  getSignUp,
  postSignUp,
  getLogIn,
} = require("../controllers/indexController");

indexRouter.get("/", (req, res) => {
  res.send("Logged In!!!");
});

indexRouter.get("/sign-up", getSignUp);

indexRouter.post("/sign-up", postSignUp);

indexRouter.get("/login", getLogIn);

indexRouter.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
    successRedirect: "/",
  }),
);

module.exports = indexRouter;
