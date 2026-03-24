const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { prisma } = require("../lib/prisma.js");
const bcrypt = require("bcryptjs");

const verifyCallback = async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return done(null, false, { message: "*Incorrect Username" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      return done(null, user);
    } else {
      return done(null, false, { message: "*Incorret Password" });
    }
  } catch (err) {
    return done(err);
  }
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    done(null, user);
  } catch (err) {
    done(err);
  }
});
