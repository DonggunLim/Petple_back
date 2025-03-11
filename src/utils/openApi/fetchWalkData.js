const fetchWalkData = (walk) => ({
  userId: walk.userId,
  petId: walk.petId,
  startTime: walk.startTime,
  startLocation: walk.startLocation,
  endTime: walk.endTime,
  endLocation: walk.endLocation,
});

module.exports = { fetchWalkData };