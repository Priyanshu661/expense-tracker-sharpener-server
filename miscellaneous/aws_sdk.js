const AWS = require("aws-sdk");

const upload_to_s3 = async (filename, data) => {
  try {
    const s3Bucket = new AWS.S3({
      accessKeyId: process.env.ACCESS_KEY_AWS,
      secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
    });

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: "public-read",
    };

   return new Promise((resolve,reject)=>{
 s3Bucket.upload(params, (err, s3Response) => {
   if (err) {
     console.log("something went wrong", err);
     reject(err)
   } else {
     resolve(s3Response);
   }
 });
   })

   
  } catch (e) {
    console.log(e);

    return e;
  }
};

module.exports = upload_to_s3;
