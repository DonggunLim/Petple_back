const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

// uid token 생성
morgan.token('id', () => uuidv4());
// timestamp token 생서
morgan.token('timestamp', () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일 ${hour}시`;
});
const productionFormat =
  '[:timestamp] [REQ-ID: :id] :method :url :status - :response-time ms';
const format = process.env.NODE_ENV === 'production' ? productionFormat : 'dev';
const morganLogger = morgan(format);

module.exports = morganLogger;
