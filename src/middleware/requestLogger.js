const morgan = require('morgan');
const env = require('../config/env');

const requestLogger = morgan(env.nodeEnv === 'production' ? 'combined' : 'dev');

module.exports = requestLogger;
