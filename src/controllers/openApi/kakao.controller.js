const axios = require('axios');
const config = require('../../consts/app');
const { createError } = require('../../utils/error');

// 공공데이터는 상세주소로 알려줌
// 상세주소 등 포함되면 변환이 안됨
const cleanAddress = (address) => {
  return address
    .split(',')[0] // 쉼표 기준으로 앞부분 주소만 유지
    .replace(/\(.*?\)/g, '') // 괄호 안 내용 삭제
    .replace(/\d+층/g, '') // 층수 제거
    .replace(/호/g, '') // 호수 제거
    .trim();
};

class KakaoController {
  // 카카오 주소 → 좌표 변환
  // https://developers.kakao.com/docs/latest/ko/local/dev-guide
  async getCoordinates(address) {
    try {
      const cleanedAddress = cleanAddress(address);
      if (!cleanedAddress) return { lat: null, lng: null };

      const response = await axios.get(config.kakao.restApiUrl, {
        params: { query: cleanedAddress },
        headers: { Authorization: `KakaoAK ${config.kakao.restApiKey}` },
      });

      if (response.data.documents.length > 0) {
        const { x, y } = response.data.documents[0];
        return { lat: parseFloat(y), lng: parseFloat(x) };
      } else {
        return { lat: null, lng: null };
      }
    } catch (error) {
      next(error);
    }
  }

  // 카카오 지도 API
  getMapScriptUrl(req, res, next) {
    try {
      if (!config.kakao.apiUrl ?? !config.kakao.apiKey) {
        throw createError(500, '카카오 지도 API 설정 오류');
      }
      const scriptUrl = `${config.kakao.apiUrl}${config.kakao.apiKey}&autoload=false`;
      return res.json({ success: true, scriptUrl });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new KakaoController();