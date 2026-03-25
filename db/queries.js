const { prisma } = require("../lib/prisma.js");

async function createUser(username, password) {
  await prisma.user.create({
    data: {
      username: username,
      password: password,
    },
  });
}

async function getFolders() {
  return await prisma.folder.findMany();
}

async function createFolder(name, userId) {
  await prisma.folder.create({
    data: {
      name: name,
      userId: userId,
    },
  });
}

module.exports = {
  createUser,
  getFolders,
  createFolder,
};
