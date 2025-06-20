const { verifyToken } = require('../consts/token');
const UserService = require('../service/user/user.service');
const { createError } = require('../utils/error');

const withAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw createError(401, '토큰이 존재하지 않습니다.');
    }

    const decodedToken = verifyToken(token);

    const email = decodedToken.email;

    const user = await UserService.findByEmail(email);
    if (!user) {
      throw createError(404, '유저가 존재하지 않습니다.');
    }
    req.user = user;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw createError(400, '토큰이 만료되었습니다.');
    }

    if (error.name === 'JsonWebTokenError') {
      throw createError(401, '토큰이 조작되었습니다.');
    }

    return next(error);
  }
};

module.exports = withAuth;
