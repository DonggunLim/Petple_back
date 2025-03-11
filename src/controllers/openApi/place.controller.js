const axios = require("axios");
const config = require("../../consts/app");
const { createError } = require("../../utils/error");
const { formatPlaceData, formatPlaceDetail } = require("../../utils/openApi/fetchPlaceData");


class PlaceController {
  async getTravelData(req, res, next) {
    try {
      const { category, page, numOfRows } = req.query;

      if (!category) {
        next(createError(400, "카테고리를 선택해주세요."));
      }

      const apiKey = config.externalData.apiKeys.place;
      const apiUrl = `${config.externalData.baseUrls.place}?serviceKey=${apiKey}&numOfRows=${numOfRows}&pageNo=${page}&MobileOS=ETC&MobileApp=Petple&listYN=Y&arrange=A&contentTypeId=${category}&_type=json`;

      const response = await axios.get(apiUrl);
      const rawData = response.data?.response?.body?.items?.item || [];

      return res.status(200).json({
        success: true,
        places: formatPlaceData(rawData),
      });
    } catch (error) {
      next(error);
    }
  }

  async getTravelDetail(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        next(createError(400, "유효한 장소 ID가 필요합니다."));
      }

      const apiKey = config.externalData.apiKeys.place;
      const apiUrl = `${config.externalData.baseUrls.placeDetail}?serviceKey=${apiKey}&contentId=${id}&MobileOS=ETC&MobileApp=Petple&_type=json`;

      const response = await axios.get(apiUrl);
      let item = response.data?.response?.body?.items?.item;

      if (!item) {
        next(createError(404, "장소 정보를 찾을 수 없습니다."));
      }

      item = Array.isArray(item) ? item[0] : item;

      return res.status(200).json({
        success: true,
        place: formatPlaceDetail(item),
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PlaceController();