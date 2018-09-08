/**
 * Created by rahulgarg on 14/06/17.
 */

const Promise = require('bluebird');
const AWS = require('aws-sdk');

const config = require('./config');

const s3 = new AWS.S3({
  accessKeyId: config.s3.access_key_id,
  secretAccessKey: config.s3.access_key_secret,
});

function getContentTypeByFile(fileName) {
  let rc = '';
  const fn = fileName.toLowerCase();
  if (fn.indexOf('.png') >= 0) rc = 'image/png';
  else if (fn.indexOf('.jpg') >= 0) rc = 'image/jpg';
  else if (fn.indexOf('.jpeg') >= 0) rc = 'image/jpeg';
  else if (fn.indexOf('.gif') >= 0) rc = 'image/gif';
  return rc;
}

exports.uploadToS3 = function uploadToS3(key, file) {
  return new Promise((resolve, reject) => {
    if (!getContentTypeByFile(file.originalname)) {
      return reject({ message: 'Unsupported file type' });
    }
    s3.upload({
      Bucket: config.s3.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: getContentTypeByFile(key),
    }, (error, response) => {
      if (error) {
        return reject(error);
      }
      resolve(response);
    });
  });
};

exports.getAWSKey = function getAWSKey(imageName) {
  const ext = imageName.substr(imageName.lastIndexOf('.') + 1);
  const name = imageName.substr(0, imageName.lastIndexOf('.')).replace(/[^a-z0-9]+/gi, '');
  return (`${name}-${new Date().getTime()}.${ext}`);
};
