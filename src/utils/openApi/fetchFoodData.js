const getValue = (field) => {
  if (!field) return "정보 없음";
  if (typeof field === "string") return field.trim();
  if (typeof field === "object") {
    return field._cdata?.trim() ?? field._text?.trim() ?? "정보 없음";
  }
  return "정보 없음";
};

const formatFoodData = (item) => {
  const price = getValue(item.mtralPc); // 가격
  const protein = getValue(item.protQy); // 단백질
  const fat = getValue(item.fatQy); // 지방
  const fiber = getValue(item.crfbQy); // 조섬유
  const moisture = getValue(item.mitrQy); // 수분
  const dryMatter = getValue(item.dryMatter); // 건물
  const tryptophan = getValue(item.trpQy); // 트립토판
  const calcium = getValue(item.clciQy); // 칼슘
  const phosphorus = getValue(item.phphQy); // 인
  const linoleicAcid = getValue(item.lnlcAcidQy); // 리놀레산
  const linolenicAcid = getValue(item.lnlnAcidQy); // 레놀렌산
  const ash = getValue(item.ashQy); // 회분
  const vitaminA = getValue(item.vitaminA); // 비타민 A
  const carbohydrates = getValue(item.carbohydrateQy); // 탄수화물
  const totalDietaryFiber = getValue(item.tdfQy); // 총 식이섬유
  const insolubleFiber = getValue(item.insolubleFiberQy); // 불용성 식이섬유
  const solubleFiber = getValue(item.solubleFiberQy); // 수용성 식이섬유
  const sodium = getValue(item.naQy); // 나트륨
  const potassium = getValue(item.kQy); // 칼륨

  return {
    id: getValue(item.feedSeqNo),
    name: getValue(item.feedNm),
    category: getValue(item.feedClCodeNm),
    origin: getValue(item.originNm),

    price:
      price === "정보 없음"
        ? price
        : `${parseInt(price, 10).toLocaleString()} 원/kg`,

    protein: protein === "정보 없음" ? protein : `${protein}%`,
    fat: fat === "정보 없음" ? fat : `${fat}%`,
    fiber: fiber === "정보 없음" ? fiber : `${fiber}%`,
    moisture: moisture === "정보 없음" ? moisture : `${moisture}%`,

    dryMatter: dryMatter === "정보 없음" ? dryMatter : `${dryMatter}%`,
    tryptophan: tryptophan === "정보 없음" ? tryptophan : `${tryptophan}%`,
    calcium: calcium === "정보 없음" ? calcium : `${calcium}%`,
    phosphorus: phosphorus === "정보 없음" ? phosphorus : `${phosphorus}%`,
    linoleicAcid: linoleicAcid === "정보 없음" ? linoleicAcid : `${linoleicAcid}%`,
    linolenicAcid: linolenicAcid === "정보 없음" ? linolenicAcid : `${linolenicAcid}%`,
    ash: ash === "정보 없음" ? ash : `${ash}%`,
    vitaminA: vitaminA === "정보 없음" ? vitaminA : `${vitaminA} RE/100g`,
    carbohydrates: carbohydrates === "정보 없음" ? carbohydrates : `${carbohydrates}%`,
    totalDietaryFiber: totalDietaryFiber === "정보 없음" ? totalDietaryFiber : `${totalDietaryFiber}%`,
    insolubleFiber: insolubleFiber === "정보 없음" ? insolubleFiber : `${insolubleFiber}%`,
    solubleFiber: solubleFiber === "정보 없음" ? solubleFiber : `${solubleFiber}%`,
    sodium: sodium === "정보 없음" ? sodium : `${sodium}%`,
    potassium: potassium === "정보 없음" ? potassium : `${potassium}%`,
  };
};

module.exports = formatFoodData;