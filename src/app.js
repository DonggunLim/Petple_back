require('./config/mongoDB.config');
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const morganLogger = require('./middleware/morganLogger.middleware');
const apiRoutes = require('./routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morganLogger);
app.use(
  cors({
    origin: ['https://petple-front.vercel.app', 'https://localhost:5173'],
    credentials: true,
  }),
);

// api
app.use('/api', apiRoutes);

//에러핸들러
app.use(errorHandler);

module.exports = app;
