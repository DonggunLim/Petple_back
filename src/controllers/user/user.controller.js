const UserService = require('../../service/user/user.service');
const crypto = require('crypto');
const { createToken, verifyToken } = require('../../consts/token');
const { createError } = require('../../utils/error');
const pets = require('../../schemas/pet/pet.schema');
const config = require('../../consts/app');

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

      const decodedToken = await verifyToken(token);

      const email = decodedToken.email;

      const user = await UserService.findByEmail(email);

      if (!user) {
        throw createError(404, '유저 정보가 없습니다!');
      }

      res.status(200).json({
        success: true,
        message: '유저 정보 조회 성공',
        user: {
          id: user._id,
          email: user.email,
          nickName: user.nickName,
          image: user.profileImage,
          pet: user.userPet,
          address: user.address,
        },
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
        nickName: userNickName,
        profileImage: profileImage,
        address: {
          jibunAddress: selectedAddress.jibunAddress,
          location: {
            type: selectedAddress.location.type,
            coordinates: selectedAddress.location.coordinates,
          },
        },
      });

      if (!updateInfo) {
        throw createError(404, '유저 정보가 없습니다.');
      }

      res.status(201).json({
        success: true,
        message: '유저 정보 업데이트 성공',
        user: updateInfo,
      });
    } catch (error) {
      next(error);
    }
  }

  async createPetInfo(req, res, next) {
    const { userId, formData, image } = req.body;

    try {
      const user = await UserService.findById(userId);

      // 새로운 반려동물 추가
      const newPet = await UserService.createPet({
        name: formData.name,
        age: formData.age,
        breed: formData.breed,
        image: image,
      });

      user.userPet.push(newPet._id);
      await user.save();

      res.status(201).json({
        success: true,
        message: '반려동물이 추가되었습니다.',
        pet: {
          id: newPet._id,
          name: newPet.name,
          age: newPet.age,
          breed: newPet.breed,
          image: newPet.image,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePetInfo(req, res, next) {
    const { userPet, petImage, petId } = req.body;

    try {
      // 기존 반려동물 프로필 수정
      const updatedPet = await UserService.updatePet(petId, {
        name: userPet.name,
        age: userPet.age,
        breed: userPet.breed,
        image: petImage,
      });

      if (!updatedPet) {
        throw createError(404, '반려동물을 찾을 수 없습니다, 업데이트 실패');
      }

      res.status(201).json({
        success: true,
        message: '반려동물 정보가 업데이트되었습니다.',
        pet: {
          _id: updatedPet._id,
          age: updatedPet.age,
          name: updatedPet.name,
          image: updatedPet.image,
          breed: updatedPet.breed,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePetInfo(req, res, next) {
    const { userId, petId } = req.body;

    const user = await UserService.findById(userId);

    if (!user) {
      throw createError(404, '유저 정보가 없습니다.');
    }

    user.userPet = user.userPet.filter((id) => id.toString() !== petId);

    await pets.findByIdAndDelete(petId);

    res.status(201).json({ success: true, message: '반려동물 정보 삭제 성공' });
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
}

module.exports = new UserController();
