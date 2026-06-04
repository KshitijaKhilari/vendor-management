const { Prisma } = require('@prisma/client');
const { sendError } = require('../utils/apiResponse');
const env = require('../config/env');

const getPrismaError = (error) => {
  if (error.code === 'P2002') {
    const fields = Array.isArray(error.meta?.target) ? error.meta.target.join(', ') : 'field';
    return {
      statusCode: 409,
      message: `Duplicate value for ${fields}`
    };
  }

  if (error.code === 'P2025') {
    return {
      statusCode: 404,
      message: 'Requested record was not found'
    };
  }

  return {
    statusCode: 500,
    message: 'Database operation failed'
  };
};

const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';
  let errors = error.errors || null;

  if (error instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500;
    message = 'Database connection failed. Please check DATABASE_URL in your .env file.';
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = getPrismaError(error);
    statusCode = prismaError.statusCode;
    message = prismaError.message;
  }

  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
  }

  if (env.nodeEnv !== 'production') {
    console.error(error);
  }

  return sendError(res, statusCode, message, errors);
};

module.exports = errorHandler;
