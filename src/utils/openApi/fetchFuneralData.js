const kakaoController = require("../../controllers/openApi/kakao.controller");

const getValue = (field) => field?.trim() ?? "정보 없음";

const formatSeoulFuneralData = async (item) => {
  const address = item.address ?? "주소 없음";

  const coordinates = await kakaoController.getCoordinates(address).catch(() => ({
    lat: null,
    lng: null,
  }));

  return {
    title: item.title,  // 장례식장 이름
    roadAddress: address,    // 주소
    phone: item.phone,  // 전화번호
    lat: coordinates.lat, // 위도
    lng: coordinates.lng, // 경도
  };
};

const formatGyeonggiFuneralData = (item) => ({
  title: getValue(item.BIZPLC_NM), // 이름
  lat: item.REFINE_WGS84_LAT ? parseFloat(item.REFINE_WGS84_LAT) : null, // 위도
  lng: item.REFINE_WGS84_LOGT ? parseFloat(item.REFINE_WGS84_LOGT) : null, // 경도
  phone: getValue(item.TELNO), // 전화번호
  zipCode: getValue(item.REFINE_ZIP_CD), // 우편번호
  roadAddress: getValue(item.REFINE_ROADNM_ADDR), // 도로명 주소
  lotAddress: getValue(item.REFINE_LOTNO_ADDR), // 지번 주소
});


module.exports = { formatSeoulFuneralData, formatGyeonggiFuneralData };