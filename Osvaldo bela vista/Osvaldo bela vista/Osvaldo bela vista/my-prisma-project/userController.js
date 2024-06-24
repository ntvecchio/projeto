const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createUser(email, name, password) {
  return await prisma.user.create({
    data: {
      email,
      name,
      password,
    },
  });
}

async function getUserById(userId) {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

async function updateUser(userId, data) {
  return await prisma.user.update({
    where: { id: userId },
    data,
  });
}

async function deleteUser(userId) {
  return await prisma.user.delete({
    where: { id: userId },
  });
}

async function getAllUsers() {
  return await prisma.user.findMany();
}

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
};
