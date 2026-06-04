const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const requestLogger = require('./middleware/requestLogger');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
