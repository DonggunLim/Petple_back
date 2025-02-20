const OauthController = require('../../controllers/user/oauth.controller');
const oauthRoutes = require('express').Router();

oauthRoutes.get('/google', OauthController.googleOauth);
oauthRoutes.get('/google/callback', OauthController.googleOauthCallback);

module.exports = oauthRoutes;
