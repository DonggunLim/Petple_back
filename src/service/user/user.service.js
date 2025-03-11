const users = require('../../schemas/user/user.schema');
const pets = require('../../schemas/pet/pet.schema');
const { createError } = require('../../utils/error');
const posts = require('../../schemas/post/post.schema');
const config = require('../../consts/app');

class UserService {
  async createUser(userData) {
    try {
      const newUser = await users.create(userData);
      return newUser.toObject();
    } catch (error) {
      throw Error('유저생성 실패' + error.message);
    }
  }

  async updateUser(userEmail, userData) {
    try {
      const update = await users.findOneAndUpdate(
        { email: userEmail },
        userData,
        {
          new: true,
        },
      );
      return update;
    } catch (error) {
      throw Error('유저 정보 업데이트 실패' + error.message);
    }
  }

  async createPet(petData) {
    try {
      const newPet = await pets.create(petData);
      return newPet.toObject();
    } catch (error) {
      throw Error('유저펫 생성 실패' + error.message);
    }
  }

  async updatePet(petId, petData) {
    try {
      const update = await pets.findOneAndUpdate({ _id: petId }, petData, {
        new: true,
      });
      return update.toObject();
    } catch (error) {
      throw Error('유저 펫 정보 업데이트 실패' + error.message);
    }
  }

  async findByEmail(userEmail) {
    const user = await users
      .findOne({ email: userEmail })
      .populate('userPet')
      .populate('address');
    return user;
  }

  async findById(userId) {
    const user = await users.findOne({ _id: userId });
    return user;
  }

  async findByKakaoId(kakaoId) {
    const user = await users.findOne({ kakaoId: kakaoId });
    return user;
  }

  async duplication(userNickName) {
    const nickName = await users.findOne({ nickName: userNickName }).lean();

    if (nickName) {
      return false;
    }
    return true;
  }

  async createNickname(userName) {
    try {
      const randomEmotion =
        config.emotion[Math.floor(Math.random() * config.emotion.length)];
      const randomNum = Math.floor(Math.random() * 9000 + 1);

      const randomNickname = `${randomEmotion}${userName}${randomNum}`;

      const checkNickname = await this.duplication(randomNickname);

      if (checkNickname) {
        return randomNickname;
      }
      return await createNickname(userName);
    } catch (error) {
      throw Error('랜덤닉네임 생성 실패' + error.message);
    }
  }

  async createEmail() {
    try {
      const randomString = Math.random().toString(36).slice(2);

      const randomEmail = `${randomString}@elice.com`;

      const existingEmail = await users.findOne({ email: randomEmail }).lean();

      if (!existingEmail) {
        return randomEmail;
      }

      return await createEmail();
    } catch (error) {
      throw Error(400, '랜덤 이메일 생성 실패');
    }
  }

  async findUsersByLocation(lng, lat) {
    try {
      const documents = await users
        .find(
          {
            'address.location': {
              $near: {
                $geometry: {
                  type: 'Point',
                  coordinates: [lng, lat],
                },
                $maxDistance: 3000,
              },
            },
          },
          '-userType -createdAt -updatedAt -__v',
        )
        .populate('userPet', '-_id -__v')
        .lean();
      return documents;
    } catch (error) {
      throw createError(500, '[DB에러 UserService.findByUsersByLocation]');
    }
  }

  async userPost(userId, page, pageSize) {
    try {
      const skipPosts = (page - 1) * pageSize;
      const userPosts = await posts
        .find({ creator: userId })
        .sort({ createdAt: -1 })
        .skip(skipPosts)
        .limit(pageSize)
        .lean();

      const totalPosts = await posts.countDocuments({ creator: userId });
      const totalPages = Math.ceil(totalPosts / pageSize);

      return { posts: userPosts, totalPages };
    } catch (error) {
      throw Error(error.message);
    }
  }

  async likePost(userId, page, pageSize) {
    try {
      const skipPosts = (page - 1) * pageSize;
      const likesPost = await posts
        .find({ likes: userId })
        .sort({ createdAt: -1 })
        .skip(skipPosts)
        .limit(pageSize)
        .lean();

      const totalPosts = await posts.countDocuments({ likes: userId });
      const totalPages = Math.ceil(totalPosts / pageSize);

      return { posts: likesPost, totalPages };
    } catch (error) {
      throw Error(error.message);
    }
  }

  async findUserByNickname(nickName) {
    try {
      const document = await users
        .findOne({ nickName }, 'userPet nickName name profileImage')
        .populate('userPet', '-__v -_id')
        .lean();
      return document;
    } catch (error) {
      throw createError(500, '[DB에러 UserService.findUserByNickname]');
    }
  }
}

module.exports = new UserService();
