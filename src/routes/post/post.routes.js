const PostController = require('../../controllers/post/post.controller');
const { token } = require('../../middleware/token.middleware');
const postsRoutes = require('express').Router();

postsRoutes.get('/', PostController.getPosts);
postsRoutes.get('/popular', PostController.getPopularPosts);
postsRoutes.get('/post/:id', PostController.getPost);
postsRoutes.post('/post', token, PostController.addPost);
postsRoutes.put('/post/:id', token, PostController.updatePost);
postsRoutes.delete('/post/:id', token, PostController.deletePost);
postsRoutes.patch('/post/:id', token, PostController.updatePostLikesField);
postsRoutes.get('/:nickname', PostController.getUserPosts);
postsRoutes.get('/like/:nickname', PostController.getUserLikePosts);

module.exports = postsRoutes;
