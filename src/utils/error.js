class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status; //status와 message를 포함한 에러 생성
  }
}

const createError = (status, message) => new AppError(message, status);

module.exports = { createError, AppError };
