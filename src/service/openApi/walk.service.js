const WalkModel = require("../../schemas/openApi/walk.schema");
const { createError } = require("../../utils/error");

class WalkService {
  async saveWalkData(walkData) {
    try {
      const walkRecord = new WalkModel(walkData);
      return await walkRecord.save();
    } catch (error) {
      throw createError(500, `산책 데이터를 저장하는 중 오류 발생: ${error.message}`);
    }
  }

  async getWalksByUser(userId) {
    try {
      return await WalkModel.find({ user: userId })
        .populate('pet', 'name image')
        .populate('user', 'profileImage')
        .lean();
    } catch (error) {
      throw createError(500, `사용자의 산책 데이터를 가져오는 중 오류 발생: ${error.message}`);
    }
  }
}

module.exports = new WalkService();