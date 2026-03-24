const { prisma } = require("../lib/prisma.js");

async function createUser(username, password) {
  await prisma.user.create({
    data: {
      username: username,
      password: password,
    },
  });
}

module.exports = {
  createUser,
};
