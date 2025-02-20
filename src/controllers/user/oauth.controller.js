const { default: axios } = require('axios');
const { createError } = require('../../utils/error');
const users = require('../../schemas/user/user.schema');
const {
  createNickname,
  createUser,
  findByEmail,
} = require('../../service/user/user.service');
const crypto = require('crypto');
const { createToken } = require('../../consts/token');

class OauthController {
  async googleOauth(req, res) {
    const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CLIENT_CALLBACK_URL}&response_type=code&scope=email profile`;
    res.redirect(googleAuthURL);
  }

  async googleOauthCallback(req, res) {
    const { code } = req.query;

    if (!code) {
      throw createError(400, '코드 없음');
    }

    try {
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code: code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: 'http://localhost:8080/api/oauth/google/callback',
          grant_type: 'authorization_code',
        },
      );

      const { access_token } = tokenResponse.data;

      const userResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );

      const { email, name, picture } = userResponse.data;

      const user = await findByEmail(email);

      // 처음 로그인한 유저이면 새로 생성
      if (!user) {
        const nickName = await createNickname(name);

        const hashedPassword = crypto
          .createHash('sha512')
          .update(email)
          .digest('base64');

        const oauthUser = await createUser({
          name: name,
          email: email,
          nickName: nickName,
          profileImage: picture,
          userType: 'google',
          password: hashedPassword,
        });

        await oauthUser.save();

        const token = createToken({ email: oauthUser.email });

        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000,
          path: '/',
        });

        res.cookie('loginStatus', 'true', {
          httpOnly: false,
          maxAge: 60 * 60 * 1000,
          path: '/', //모든 경로에 쿠키포함
        });

        return res.redirect(`http://localhost:5173/`);
      }

      // 로그인한 기록이 있는 유저이면 로그인
      const token = createToken({ email: user.email });

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        path: '/',
      });

      res.cookie('loginStatus', 'true', {
        httpOnly: false,
        maxAge: 60 * 60 * 1000,
        path: '/', //모든 경로에 쿠키포함
      });

      return res.redirect(`http://localhost:5173/`);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OauthController();
