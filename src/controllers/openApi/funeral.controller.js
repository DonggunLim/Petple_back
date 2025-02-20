const axios = require("axios");
const config = require("../../consts/app");
const formatFuneralData = require("../../utils/openApi/formatFuneralData");

const apiUrls = {
  경기: `${config.externalData.baseUrls.gyeonggi}/DoanmalfunrlPrmisnentrp`,
};

class FuneralController {
  async getFuneralData(req, res, next) {
    try {
      const { region } = req.query;

      const response = await axios.get(apiUrls[region], {
        params: { KEY: config.externalData.apiKeys.gyeonggi, Type: "json", pIndex: 1 },
      });

      const rawData = response.data?.DoanmalfunrlPrmisnentrp?.[1]?.row || [];

      return res.status(200).json({
        success: true,
        funeralData: rawData.map(formatFuneralData),
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FuneralController();