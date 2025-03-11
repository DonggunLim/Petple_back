const axios = require('axios');
const convert = require('xml-js');
const config = require('../../consts/app');
const formatFoodData = require('../../utils/openApi/fetchFoodData');

class FoodController {
  async getPetFood(req, res, next) {
    try {
      const { search = '', category = '' } = req.query;

      const categoryMapping = {
        livestock: '402002',
        fishery: '402003',
        agriculture: '402001',
        byproduct: '402004',
        etc: '402005',
      };

      const params = {
        sFeedNm: search,
        ...(categoryMapping[category] && {
          upperFeedClCode: categoryMapping[category],
        }),
      };

      const response = await axios.get(`${config.externalData.baseUrls.food}`, {
        params: { apiKey: config.externalData.apiKeys.food, ...params },
      });

      const jsonData = JSON.parse(
        convert.xml2json(response.data, { compact: true, spaces: 2 }),
      );

      const items = jsonData?.response?.body?.items?.item || [];
      const itemList = Array.isArray(items) ? items : [items];
      const foodData = itemList.map(formatFoodData);

      return res.status(200).json({ success: true, data: foodData });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FoodController();
