const { Router } = require("express");
const passport = require("passport");

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = indexRouter;
