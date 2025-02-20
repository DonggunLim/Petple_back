require('dotenv').config();

const config = {
  app: {
    port: 8080,
    frontUrl: process.env.FRONT_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    s3: {
      bucketName: process.env.BUCKET_NAME,
    },
  },
  kakao: {
    apiUrl: process.env.KAKAO_OPEN_API_URL,
    apiKey: process.env.KAKAO_OPEN_API_KEY,
    restApiUrl: process.env.KAKAO_OPEN_REST_API_URL,
    restApiKey: process.env.KAKAO_OPEN_REST_API_KEY,
  },
  externalData: { 
    baseUrls: {
      gyeonggi: process.env.BASE_URL_GYEONGGI,
      seoul: process.env.BASE_URL_SEOUL,
      place: process.env.PLACE_OPEN_API_URL,
      placeDetail: process.env.PLACE_DETAIL_OPEN_API_URL,
      placeCommon: process.env.PLACE_COMMON_OPEN_API_URL,
      food: process.env.FOOD_OPEN_API_URL,
    },
    apiKeys: {
      gyeonggi: process.env.OPEN_GYEONGGI_API_KEY,
      seoul: process.env.OPEN_SEOUL_API_KEY,
      place: process.env.PLACE_OPEN_API_KEY,
      food: process.env.FOOD_OPEN_API_KEY,
    },
  },
};

module.exports = config;
