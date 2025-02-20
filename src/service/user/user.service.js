const users = require('../../schemas/user/user.schema');
const pets = require('../../schemas/pet/pet.schema');

const createUser = async (userData) => {
  try {
    const newUser = await users.create(userData);
    return newUser.toObject();
  } catch (error) {
    throw Error('유저생성 실패' + error.message);
  }
};

const createPet = async (petData) => {
  try {
    const newPet = await pets.create(petData);
    return newPet;
  } catch (error) {
    throw Error('유저펫 생성 실패' + error.message);
  }
};

const findByEmail = (userEmail) => {
  const user = users.findOne({ email: userEmail });
  return user;
};

const findById = async (userId) => {
  const user = await users.findOne({ _id: userId });
  return user;
};

const createNickname = async (userName) => {
  const emotion = [
    '행복한',
    '즐거운',
    '기쁜',
    '신나는',
    '고마운',
    '상냥한',
    '포근한',
    '친숙한',
    '쾌활한',
    '뿌듯한',
    '귀여운',
    '멋진',
    '설레는',
  ];

  const randomEmotion = emotion[Math.floor(Math.random() * emotion.length)];
  const randomNum = Math.floor(Math.random() * 9000 + 1);

  const randomNickname = `${randomEmotion}${userName}${randomNum}`;

  const checkNickname = await duplication(randomNickname);

  if (checkNickname) {
    return randomNickname;
  }
  return await createNickname(userName);
};

const duplication = async (userNickName) => {
  const nickName = await users.findOne({ nickName: userNickName });

  if (nickName) {
    return false;
  }
  return true;
};

module.exports = {
  createUser,
  findByEmail,
  createNickname,
  duplication,
  findById,
  createPet,
};
