const getValue = (field) => field?.trim() ?? "정보 없음";

const formatFuneralData = (item) => ({
  name: getValue(item.BIZPLC_NM), // 이름
  lat: parseFloat(item.REFINE_WGS84_LAT) ?? null, // 위도
  lng: parseFloat(item.REFINE_WGS84_LOGT) ?? null, // 경도
  phone: getValue(item.TELNO), // 전화번호
  zipCode: getValue(item.REFINE_ZIP_CD), // 우편번호
  roadAddress: getValue(item.REFINE_ROADNM_ADDR), // 도로명 주소
  lotAddress: getValue(item.REFINE_LOTNO_ADDR), // 지번 주소
});

module.exports = formatFuneralData;