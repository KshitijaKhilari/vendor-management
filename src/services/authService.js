const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const { generateToken } = require('../utils/jwt');

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt
});

const register = async ({ name, email, password, role }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new AppError('A user with this email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, env.bcryptSaltRounds);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'ADMIN'
    }
  });

  const token = generateToken({
    id: user.id,
    role: user.role
  });

  return {
    user: sanitizeUser(user),
    token
  };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken({
    id: user.id,
    role: user.role
  });

  return {
    user: sanitizeUser(user),
    token
  };
};

module.exports = {
  register,
  login
};
