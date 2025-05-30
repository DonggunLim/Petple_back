const PostController = require('../../controllers/post/post.controller');
const postLikeController = require('../../controllers/postLike/postLike.controller');
const withAuth = require('../../middleware/withAuth.middleware');
const postsRoutes = require('express').Router();

postsRoutes.get('/', PostController.getPosts);
postsRoutes.get('/popular', PostController.getPopularPosts);
postsRoutes.get('/post/:id', PostController.getPost);
postsRoutes.get('/:nickname', PostController.getUserPosts);
postsRoutes.get('/like/:nickname', PostController.getUserLikePosts);
postsRoutes.post('/post', withAuth, PostController.addPost);
postsRoutes.post('/:id/like', withAuth, postLikeController.toggleLike);
postsRoutes.put('/post/:id', withAuth, PostController.updatePost);
postsRoutes.delete('/post/:id', withAuth, PostController.deletePost);

module.exports = postsRoutes;
