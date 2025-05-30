require('./src/config/mongoDB.config');
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const errorHandler = require('./src/middleware/errorHandler');
const userRoutes = require('./src/routes/user/user.routes');
const oauthRoutes = require('./src/routes/oauth/oauth.routes');
const imageRoutes = require('./src/routes/image/image.routes');
const postsRoutes = require('./src/routes/post/post.routes');
const commentRoutes = require('./src/routes/comment/comment.routes');
const publicRoutes = require('./src/routes/openApi/public.routes');
const chatRoutes = require('./src/routes/chat/chat.routes');
const alarmRoutes = require('./src/routes/alarm/alarm.routes');
const morganLogger = require('./src/middleware/morganLogger.middleware');

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

//라우터
app.use('/api/my', userRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/alarms', alarmRoutes);

//에러핸들러
app.use(errorHandler);

module.exports = app;
