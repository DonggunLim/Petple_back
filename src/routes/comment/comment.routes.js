const CommentController = require('../../controllers/comment/comment.controller');
const withAuth = require('../../middleware/withAuth.middleware');

const commentRoutes = require('express').Router();

commentRoutes.post('/', withAuth, CommentController.addComment);
commentRoutes.put('/:id', withAuth, CommentController.updateComment);
commentRoutes.delete('/:id', withAuth, CommentController.deleteComment);

module.exports = commentRoutes;
