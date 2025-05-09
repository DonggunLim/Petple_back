const PostController = require('../../controllers/post/post.controller');
const postLikeController = require('../../controllers/postLike/postLike.controller');
const { token } = require('../../middleware/token.middleware');
const postsRoutes = require('express').Router();

postsRoutes.get('/', PostController.getPosts);
postsRoutes.get('/popular', PostController.getPopularPosts);
postsRoutes.get('/post/:id', PostController.getPost);
postsRoutes.get('/:nickname', PostController.getUserPosts);
postsRoutes.get('/like/:nickname', PostController.getUserLikePosts);
postsRoutes.post('/post', token, PostController.addPost);
postsRoutes.post('/:id/like', token, postLikeController.toggleLike);
postsRoutes.put('/post/:id', token, PostController.updatePost);
postsRoutes.delete('/post/:id', token, PostController.deletePost);

module.exports = postsRoutes;
