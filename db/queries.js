const { prisma } = require("../lib/prisma.js");

async function createUser(username, password) {
  await prisma.user.create({
    data: {
      username: username,
      password: password,
    },
  });
}

async function getUser(username) {
  return await prisma.user.findUnique({
    where: { username },
  });
}

async function getFolders(userId) {
  return await prisma.folder.findMany({
    where: { userId: userId },
    orderBy: {
      id: "asc",
    },
  });
}

async function getFolder(id) {
  return await prisma.folder.findUnique({
    where: { id: Number(id) },
  });
}

async function createFolder(name, userId) {
  await prisma.folder.create({
    data: {
      name: name,
      userId: userId,
    },
  });
}

async function updateFolder(id, name) {
  await prisma.folder.update({
    where: { id: Number(id) },
    data: { name: name },
  });
}

async function deleteFolder(id) {
  await prisma.folder.delete({
    where: { id: Number(id) },
  });
}

async function createFile(name, size, userId, folderId, publicId, url) {
  await prisma.file.create({
    data: { name, size, userId, folderId: Number(folderId), publicId, url },
  });
}

async function getFiles(userId, folderId) {
  return await prisma.file.findMany({
    where: { userId, folderId: Number(folderId) },
  });
}

async function getFile(id) {
  return await prisma.file.findUnique({
    where: { id: Number(id) },
  });
}

module.exports = {
  createUser,
  getUser,
  getFolders,
  getFolder,
  createFolder,
  updateFolder,
  deleteFolder,
  createFile,
  getFiles,
  getFile,
};
