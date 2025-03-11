const UserController = require('../../controllers/user/user.controller');
const userRoutes = require('express').Router();
const { token } = require('../../middleware/token.middleware');

userRoutes.get('/info', token, UserController.getUserInfo); // /api/my/info
userRoutes.post('/nickname/check', token, UserController.nickNameConfirm); // /api/my/nickname/check
userRoutes.post('/info/update', token, UserController.updateUserInfo); // /api/my/info/update
userRoutes.post('/pet/create', token, UserController.createPetInfo); // /api/my/pet/create
userRoutes.post('/pet/:petId', token, UserController.updatePetInfo); // /api/my/pet/update
userRoutes.delete('/pet/:petId', token, UserController.deletePetInfo); // /api/my/pet/delete
userRoutes.get('/near', UserController.getUsersByLocation);
userRoutes.get('/:nickname', UserController.getUserByNickname);
userRoutes.get('/coordinate/:address', UserController.getCoordinate);

module.exports = userRoutes;
