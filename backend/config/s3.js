const { S3Client } = require('@aws-sdk/client-s3');
const multer=require('multer');
const dotenv=require('dotenv');
const multerS3=require('multer-s3');

dotenv.config();

const s3= new S3Client({
    region: process.env.AWS_REGION,
    credentials:{
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});


const upload=multer(
    {
        storage:multerS3({
            s3:s3,
            bucket: process.env.AWS_BUCKET_NAME,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            metadata: (req, file, cb) =>{
                cb(null, {fieldName:file.fieldname});
            },
            key: (req, file, cb)=>{
                cb(null, `posts/${Date.now()}_${file.originalname}`);
            }
        }) 
    }
);

module.exports=upload;