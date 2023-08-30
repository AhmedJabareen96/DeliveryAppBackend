const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET, // Corrected the reference to AWS_SECRET
});

const BUCKET = 'deliveryapp-bucket1';

module.exports = {
  s3,
  BUCKET,
};



