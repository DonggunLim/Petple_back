const axios = require('axios');
const config = require('../../consts/app');
const { createError } = require('../../utils/error');

// 공공데이터는 상세주소로 알려줌
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
  async getCoordinates(address, next) {
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

  // 좌표 → 카카오 주소 변환
  async getAddressFromCoordinates(lat, lng, next) {
    try {
      if (!lat || !lng) return next(createError(400, "위도 또는 경도가 유효하지 않습니다."));
    
      const response = await axios.get(config.kakao.reverseGeocodeUrl, {
        params: { x: lng, y: lat },
        headers: { Authorization: `KakaoAK ${config.kakao.restApiKey}` },
      });

      if (!response.data || !response.data.documents || response.data.documents.length === 0) {
        return next(createError(404, "카카오 API에서 주소 데이터를 찾을 수 없습니다."));
      }

      // 도로명 주소, 건물명 가져오기
      const roadAddress = response.data.documents[0].road_address?.address_name || "";
      const buildingName = response.data.documents[0].road_address?.building_name?.trim() || "";

      return {
        address: roadAddress,
        buildingName: buildingName !== "" ? buildingName : "건물명 정보 없음",
      };
    } catch (error) {
      next(error);
    }
  }

  // 카카오 지도 API 스크립트 URL 반환
  getMapScriptUrl(req, res, next) {
    try {
      if (!config.kakao.apiUrl || !config.kakao.apiKey) {
        return next(createError(500, '카카오 지도 API 설정 오류'));
      }
      const scriptUrl = `${config.kakao.apiUrl}${config.kakao.apiKey}&autoload=false&libraries=services`;
      return res.json({ success: true, scriptUrl });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new KakaoController();