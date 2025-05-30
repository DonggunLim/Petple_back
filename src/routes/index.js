const alarmRoutes = require('./alarm/alarm.routes');
const chatRoutes = require('./chat/chat.routes');
const commentRoutes = require('./comment/comment.routes');
const imageRoutes = require('./image/image.routes');
const oauthRoutes = require('./oauth/oauth.routes');
const publicRoutes = require('./openApi/public.routes');
const postsRoutes = require('./post/post.routes');
const userRoutes = require('./user/user.routes');

const apiRoutes = require('express').Router();

apiRoutes.use('/my', userRoutes);
apiRoutes.use('/oauth', oauthRoutes);
apiRoutes.use('/images', imageRoutes);
apiRoutes.use('/posts', postsRoutes);
apiRoutes.use('/comments', commentRoutes);
apiRoutes.use('/public', publicRoutes);
apiRoutes.use('/chat', chatRoutes);
apiRoutes.use('/alarms', alarmRoutes);

module.exports = apiRoutes;
