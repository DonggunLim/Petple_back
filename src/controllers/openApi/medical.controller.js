const axios = require("axios");
const config = require("../../consts/app");
const { createError } = require("../../utils/error");
const formatMedicalData = require("../../utils/openApi/formatMedicalData");

const apiUrls = {
  경기: {
    hospital: `${config.externalData.baseUrls.gyeonggi}/Animalhosptl?Type=json&KEY=${config.externalData.apiKeys.gyeonggi}`,
    pharmacy: `${config.externalData.baseUrls.gyeonggi}/AnimalPharmacy?Type=json&KEY=${config.externalData.apiKeys.gyeonggi}`,
  },
  서울: {
    hospital: `${config.externalData.baseUrls.seoul}/${config.externalData.apiKeys.seoul}/json/LOCALDATA_020301/1/100`,
    pharmacy: `${config.externalData.baseUrls.seoul}/${config.externalData.apiKeys.seoul}/json/LOCALDATA_020302/1/100`,
  },
};

class MedicalController {
  async getMedicalData(req, res, next) {
    try {
      const { region, type } = req.query;

      if (!region || !type) {
        throw createError(400, "지역과 종류(type)가 필요합니다.");
      }

      if (!apiUrls[region]?.[type]) {
        throw createError(400, "유효한 지역 또는 유형이 아닙니다.");
      }

      const response = await axios.get(apiUrls[region][type]);

      const rawData =
        region === "경기"
          ? response.data?.[type === "hospital" ? "Animalhosptl" : "AnimalPharmacy"]?.[1]?.row || []
          : response.data?.[type === "hospital" ? "LOCALDATA_020301" : "LOCALDATA_020302"]?.row || [];

      return res.status(200).json({
        success: true,
        medicalData: await formatMedicalData(rawData, region),
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MedicalController();