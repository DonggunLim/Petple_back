const FuneralModel = require('../../schemas/openApi/seoul.schema');
const { formatSeoulFuneralData } = require('../../utils/openApi/fetchFuneralData');
const { createError } = require("../../utils/error");

class FuneralService {
  async getSeoulFuneralData() {
    try {
      const seoulData = await FuneralModel.find({}).lean();
      if (!seoulData || seoulData.length === 0) {
        throw createError(404, '서울 장례 데이터가 없습니다.');
      }

      const formattedData = await Promise.all(
        seoulData.map(async (item) => {
          try {
            return await formatSeoulFuneralData(item);
          } catch (error) {
            return null;
          }
        })
      );

      return formattedData.filter((data) => data !== null);
    } catch (error) {
      throw createError(500, `서울 장례 데이터를 가져오는 중 오류 발생: ${error.message}`);
    }
  }
}

module.exports = new FuneralService();