const CommentController = require('../../controllers/comment/comment.controller');
const { token } = require('../../middleware/withAuth.middleware');

const commentRoutes = require('express').Router();

commentRoutes.post('/', token, CommentController.addComment);
commentRoutes.put('/:id', token, CommentController.updateComment);
commentRoutes.delete('/:id', token, CommentController.deleteComment);

module.exports = commentRoutes;
