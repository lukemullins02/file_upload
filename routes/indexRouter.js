const { Router } = require("express");
const passport = require("passport");

const indexRouter = Router();

const { getSignUp, postSignUp } = require("../controllers/indexController");

indexRouter.get("/sign-up", getSignUp);

indexRouter.post("/sign-up", postSignUp);

module.exports = indexRouter;
