const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const config = require('../../consts/app');
const awsS3 = require('../../config/awsS3.config');
const { createError } = require('../../utils/error');

const getPresignedUrl = async (req, res, next) => {
  const { fileName, fileType } = req.query;
  if (!fileName || !fileType) {
    throw createError(400, '파일이름과 타입이 필요합니다.');
  }
  const params = {
    Bucket: config.aws.s3.bucketName,
    Key: `images/${fileName}`,
    ContentType: fileType,
  };
  try {
    const command = new PutObjectCommand(params);
    const presignedUrl = await getSignedUrl(awsS3, command, { expiresIn: 60 });
    return res.status(200).json({ success: true, presignedUrl });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPresignedUrl,
};
