module.exports.isAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

module.exports.loggedIn = (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    res.redirect("/");
  }
};
