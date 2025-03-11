const walkService = require('../../service/openApi/walk.service');
const { fetchWalkData } = require('../../utils/openApi/fetchWalkData');
const { createError } = require('../../utils/error');
const kakaoController = require('./kakao.controller');

class WalkController {
  async saveWalk(req, res, next) {
    try {
      const walkData = req.body;

      // 산책 시간 구하기
      const start = new Date(walkData.startTime);
      const end = new Date(walkData.endTime);

      // 총 걸린 시간 구하기
      const diffMs = end - start;
      const hours = Math.floor(diffMs / (1000 * 60 * 60)); // 시간
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // 분
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000); // 초

      walkData.duration = `${hours}시간 ${minutes}분 ${seconds}초`;

      // 시작 위치(역지오코딩)
      const startLocation = await kakaoController.getAddressFromCoordinates(
        walkData.startLocation.lat,
        walkData.startLocation.lng,
      );

      // 종료 위치(역지오코딩)
      const endLocation = await kakaoController.getAddressFromCoordinates(
        walkData.endLocation.lat,
        walkData.endLocation.lng,
      );

      walkData.startLocation = startLocation;
      walkData.endLocation = endLocation;

      const savedWalk = await walkService.saveWalkData(walkData);
      return res
        .status(201)
        .json({ success: true, walk: fetchWalkData(savedWalk) });
    } catch (error) {
      next(error);
    }
  }

  async getUserWalks(req, res, next) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return next(createError(400, '사용자 ID가 필요합니다.'));
      }

      const userWalks = await walkService.getWalksByUser(userId);
      if (!userWalks.length) {
        return next(createError(404, '산책 기록을 찾을 수 없습니다.'));
      }

      return res.status(200).json({
        success: true,
        walks: userWalks.map((walk) => ({
          ...fetchWalkData(walk),
          petName: walk.pet?.name || "알 수 없음",
          petImage: walk.pet?.image || null,
          userProfileImage: walk.user?.profileImage || null,
          duration: walk.duration || "데이터 없음",
        })),
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WalkController();
