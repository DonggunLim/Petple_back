const { getPresignedUrl } = require('../../controllers/image/image.controller');

const imageRoutes = require('express').Router();

imageRoutes.get('/s3/presigned-url', getPresignedUrl);

module.exports = imageRoutes;
