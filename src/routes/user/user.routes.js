const UserController = require('../../controllers/user/user.controller');
const userRoutes = require('express').Router();
const withAuth = require('../../middleware/withAuth.middleware');

userRoutes.get('/info', withAuth, UserController.getUserInfo); // /api/my/info
userRoutes.get('/near', UserController.getUsersByLocation);
userRoutes.get('/guest-signin', UserController.signinWithGuest);
userRoutes.get('/:nickname', UserController.getUserByNickname);
userRoutes.get('/coordinate/:address', UserController.getCoordinate);
userRoutes.post('/nickname/check', withAuth, UserController.nickNameConfirm); // /api/my/nickname/check
userRoutes.post('/info/update', withAuth, UserController.updateUserInfo); // /api/my/info/update
userRoutes.post('/pet/create', withAuth, UserController.createPetInfo); // /api/my/pet/create
userRoutes.post('/pet/:petId', withAuth, UserController.updatePetInfo); // /api/my/pet/update
userRoutes.delete('/pet/:petId', withAuth, UserController.deletePetInfo); // /api/my/pet/delete

module.exports = userRoutes;
