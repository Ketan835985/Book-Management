const aws = require('aws-sdk');
const { AWS_ACCESS_KEY_SECRET, AWS_ACCESS_KEY } = require('../../config')


aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_ACCESS_KEY_SECRET,
    region: "ap-south-1"
})

const uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        // this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: '2006-03-01' }); // we will be using the s3 service of aws

        let uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",  //HERE
            Key: "abc/" + file.originalname, //HERE 
            Body: file.buffer
        }


        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            console.log(data)
            console.log("file uploaded successfully")
            return resolve(data.Location)
        })
        // let data= await s3.upload( uploadParams)
        // if( data) return data.Location
        // else return "there is an error"
    })
}
// const { S3Client, GetObjectCommand ,PutObjectCommand} = require("@aws-sdk/client-s3");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// require("dotenv").config()


// const bucketname = process.env.BUCKETNAME;
// const bucketregin = process.env.BUCKETREGIN;
// const accesskey = process.env.ACCESSKEY;
// const seceretaccesskey = process.env.SECERETACCESSKEY;

// const s3Client = new S3Client({
//  region:bucketregin,
//   credentials: {
//     accessKeyId: accesskey,
//     secretAccessKey: seceretaccesskey,
//   },
// });

// //    async function  getObjectURL(key){
// //          const commend= new GetObjectCommand({
// //             Bucket : bucketname,
// //             Key:key
// //          })
// //          const url=await getSignedUrl(s3Client,commend);
// //          return url;
// //     }

// //     async function init(){
// //     console.log("urlfor uploading",await getObjectURL("amanph.jpg"))
// // }
// // init()



// //===========================================
//     async function PutObject(filename){
//         const commend =new PutObjectCommand({
//             Bucket:bucketname,
//             Key:"/upload/image",
//             // ContentType:contentType
//         })
//         const url=await getSignedUrl(s3Client,commend);
//            console.log(url)
//         return url;
//     }
// // async function init(){
// //     console.log("urlfor uploading",await PutObject(`image-${Date.now()}.jpeg`,"image/jpeg"))
// // }
// // init()

module.exports = uploadFile