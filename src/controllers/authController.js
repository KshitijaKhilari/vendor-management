const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);

  return sendSuccess(res, 201, 'User registered successfully', result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  return sendSuccess(res, 200, 'Login successful', result);
});

module.exports = {
  register,
  login
};
