require('./db_init');
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const errorHandler = require('./src/middleware/errorHandler');
const userRoutes = require('./src/routes/user/user.routes');
const oauthRoutes = require('./src/routes/oauth/oauth.routes');
const imageRoutes = require('./src/routes/image/image.routes');
const postsRoutes = require('./src/routes/post/post.routes');
const commentRoutes = require('./src/routes/comment/comment.routes');
const publicRoutes = require('./src/routes/openApi/public.routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//라우터
app.use('/api/user', userRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/public', publicRoutes);

//에러핸들러
app.use(errorHandler);

module.exports = app;
