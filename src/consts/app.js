require('dotenv').config();

const state = encodeURIComponent(`myapp-${Date.now()}`);

const config = {
  app: {
    port: 3000,
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
    reverseGeocodeUrl: process.env.KAKAO_OPEN_RESERVE_API_URL,
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
      vword: process.env.VWORLD_API_KEY,
    },
  },
  oauth: {
    kakao: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_OAUTH_REST_API_KEY}&redirect_uri=${process.env.KAKAO_OAUTH_REDIRECT_URI}`,
    google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CLIENT_CALLBACK_URL}&response_type=code&scope=email profile`,
    naver: `https://nid.naver.com/oauth2.0/authorize?client_id=${process.env.NAVER_OAUTH_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NAVER_OAUTH_REDIRECT_URI}&state=${state}`,
  },
  emotion: [
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
  ],
};

module.exports = config;
