const errorHandler = (err, req, res, next) => {
  const status = err.status || 500; // 상태 코드가 없으면 500//
  const message = err.message || "서버 오류가 발생했습니다.";

  console.error(`[Error] ${status} - ${message} - ${req.method} ${req.url}`);

  res.status(status).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
