const getValue = (field) => field?.trim() ?? "정보 없음";

const formatPlaceData = (data) =>
  data.map((item) => ({
    id: getValue(item.contentid),
    title: getValue(item.title),
    imageUrl: item.firstimage ?? null,
    address: getValue(item.addr1),
    lat: parseFloat(item.mapy) ?? null,
    lng: parseFloat(item.mapx) ?? null,
    tel: getValue(item.tel),
  }));

const formatPlaceDetail = (item) => ({
  additionalInfo: {
    acmpyNeedMtr: getValue(item.acmpyNeedMtr),
    relaAcdntRiskMtr: getValue(item.relaAcdntRiskMtr),
    acmpyTypeCd: getValue(item.acmpyTypeCd),
    relaPosesFclty: getValue(item.relaPosesFclty),
    relaFrnshPrdlst: getValue(item.relaFrnshPrdlst),
    etcAcmpyInfo: getValue(item.etcAcmpyInfo),
    relaPurcPrdlst: getValue(item.relaPurcPrdlst),
    acmpyPsblCpm: getValue(item.acmpyPsblCpm),
    relaRntlPrdlst: getValue(item.relaRntlPrdlst),
  },
});

module.exports = { formatPlaceData, formatPlaceDetail };