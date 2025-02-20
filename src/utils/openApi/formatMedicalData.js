const getValue = (field) => field?.trim() ?? "정보 없음";
const formatMedicalData = async (data, region) => {
  const seen = new Set();

  return Promise.all(
    data.map(async (item) => {
      const address = item.RDNWHLADDR ?? item.SITEWHLADDR ?? "";
      const coordinates =
        region === "서울"
          ? await kakaoController.getCoordinates(address).catch(() => ({
              lat: null,
              lng: null,
            }))
          : {
              lat: parseFloat(item.REFINE_WGS84_LAT ?? item.Y) ?? null,
              lng: parseFloat(item.REFINE_WGS84_LOGT ?? item.X) ?? null,
            };

      const formattedItem = {
        name: getValue(item.BPLCNM ?? item.BIZPLC_NM),
        lat: coordinates.lat,
        lng: coordinates.lng,
        businessState: getValue(item.BSN_STATE_NM ?? item.TRDSTATENM),
        phone: getValue(item.TELNO ?? item.SITETEL),
        roadAddress: getValue(item.REFINE_ROADNM_ADDR ?? item.RDNWHLADDR),
        lotAddress: getValue(item.REFINE_LOTNO_ADDR ?? item.SITEWHLADDR),
      };

      // 중복 제거 (이름 + 도로명 주소 기준)
      const uniqueKey = `${formattedItem.name}-${formattedItem.roadAddress}`;
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        return formattedItem;
      }

      return null;
    })
  ).then((result) => result.filter((item) => item !== null));
};

module.exports = formatMedicalData;