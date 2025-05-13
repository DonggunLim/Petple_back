const UserService = require('../../service/user/user.service');
const crypto = require('crypto');
const { createToken, verifyToken } = require('../../consts/token');
const { createError } = require('../../utils/error');
const pets = require('../../schemas/pet/pet.schema');
const config = require('../../consts/app');
const PetService = require('../../service/pet/pet.serivce');

class UserController {
  async signup(req, res, next) {
    const { name, email, password } = req.body;

    const hashedPassword = crypto
      .createHash('sha512')
      .update(password)
      .digest('base64');

    try {
      const existingUser = await UserService.findByEmail(email);

      const randomNickname = await UserService.createNickname(name);

      if (existingUser) {
        throw createError(409, '이미 존재하는 이메일');
      }

      await UserService.createUser({
        name: name,
        email: email,
        password: hashedPassword,
        nickName: randomNickname,
      });

      res.status(201).json({ success: true, message: '회원가입 성공!' });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    const { email } = req.body;

    try {
      const user = await UserService.findByEmail(email);
      if (!user) {
        throw createError(404, '가입된 회원 정보가 없습니다.');
      }

      const token = createToken({ email: user.email, userId: user._id });

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        path: '/', //모든 경로에 쿠키포함
      });

      res.cookie('loginStatus', 'true', {
        httpOnly: false,
        maxAge: 60 * 60 * 1000,
        path: '/', //모든 경로에 쿠키포함
      });

      res.status(200).json({
        success: true,
        message: '로그인 성공',
        user: {
          id: user._id,
          email: user.email,
          nickName: user.nickName,
          userImage: user.profileImage,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserInfo(req, res, next) {
    const { token } = req.cookies;

    try {
      if (!token) {
        throw createError(400, '토큰없음, 유저 정보 불러오기 실패');
      }

      const decodedToken = verifyToken(token);
      const email = decodedToken.email;
      const user = await UserService.findByEmail(email);

      if (!user) {
        throw createError(404, '유저 정보가 없습니다!');
      }
      res.status(200).json({
        success: true,
        message: '유저 정보 조회 성공',
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  async nickNameConfirm(req, res, next) {
    const { nickName } = req.body;

    try {
      const confirm = await UserService.duplication(nickName);

      if (!confirm) {
        throw createError(409, '이미 사용중인 닉네임 입니다.');
      }
      return res
        .status(200)
        .json({ success: true, message: '사용 가능한 닉네임 입니다.' });
    } catch (error) {
      next(error);
    }
  }

  async updateUserInfo(req, res, next) {
    const { userNickName, profileImage, userEmail, selectedAddress } = req.body;
    const { token } = req.cookies;
    try {
      if (!token) {
        throw createError(400, '토큰 인증 실패');
      }

      const updateInfo = await UserService.updateUser(userEmail, {
        nickname: userNickName,
        profileImage: profileImage,
        jibunAddress: selectedAddress.jibun_address,
        lng: selectedAddress.lng,
        lat: selectedAddress.lat,
      });

      res.status(201).json({
        success: true,
        message: '유저 정보 업데이트 성공',
      });
    } catch (error) {
      next(error);
    }
  }

  async createPetInfo(req, res, next) {
    const { userId, formData, image } = req.body;

    try {
      // 새로운 반려동물 추가
      const petId = await UserService.createPet({
        name: formData.name,
        age: formData.age,
        breed: formData.breed,
        image: image,
        userId,
      });

      return res.status(201).json({
        success: true,
        petId,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePetInfo(req, res, next) {
    const { petId, name, age, breed, image } = req.body;

    try {
      await PetService.updatePet({
        id: petId,
        name,
        age,
        breed,
        image,
      });

      return res.status(201).json({
        success: true,
        message: '반려동물 정보가 업데이트되었습니다.',
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePetInfo(req, res, next) {
    const { petId } = req.params;
    const { id } = req.user;
    try {
      if (!id) {
        throw createError(404, '유저 정보가 없습니다.');
      }
      await PetService.deletePet(petId);
      return res
        .status(200)
        .json({ success: true, message: '반려동물 정보 삭제 성공' });
    } catch (error) {
      next(error);
    }
  }

  async getUsersByLocation(req, res, next) {
    const { lat, lng } = req.query;
    if (!lat || !lng) throw createError(400, '위치 정보가 필요합니다.');
    try {
      const users = (await UserService.findUsersByLocation(lng, lat)) ?? [];
      return res.status(200).json({ success: true, users });
    } catch (error) {
      next(error);
    }
  }

  async getUserByNickname(req, res, next) {
    const { nickname } = req.params;
    try {
      if (!nickname) {
        throw createError(400, '유저 정보가 필요합니다.');
      }
      const user = await UserService.findUserByNickname(nickname);
      if (!user) {
        throw createError(400, '대화 상대를 찾을 수 없습니다.');
      }
      return res.status(200).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  }

  async getCoordinate(req, res, next) {
    try {
      const { address } = req.params;

      if (!address) {
        throw createError(400, '주소가 필요합니다.');
      }

      const apiKey = config.externalData.apiKeys.vword;

      const encodedAddress = encodeURIComponent(address);
      const apiUrl = `https://api.vworld.kr/req/address?service=address&request=getcoord&version=2.0&crs=epsg:4326&address=${encodedAddress}&refine=true&simple=false&format=json&type=road&key=${apiKey}`;

      const response = await fetch(apiUrl, {
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-store',
      });

      const data = await response.json();

      if (!data) {
        throw createError(400, '주소 좌표 변환 실패');
      }

      const point = data.response.result.point;
      res.json({ x: point.x, y: point.y });
    } catch (error) {
      console.error('좌표 변환 오류:', error);
      next(error);
    }
  }

  async signinWithGuest(req, res, next) {
    try {
      const { email, id } = await UserService.fetchGuestUser();

      const token = createToken({
        email,
        userId: id,
      });

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 60 * 60 * 1000,
        path: '/',
      });

      return res.json({ isSuccess: true, loginStatus: true });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
