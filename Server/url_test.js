import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config(); // Load AWS credentials from .env

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

// Generate Presigned URL for Upload
export async function generateUploadURL(fileName, fileType) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    ContentType: fileType, // e.g., "image/png"
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // expires in 60 sec
  return { url };
}

// Generate Presigned URL for Download
// export async function generateDownloadURL(fileName) {
//   const command = new GetObjectCommand({
//     Bucket: process.env.S3_BUCKET,
//     Key: fileName,
//   });

//   const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // expires in 60 sec
//   return url;
// }

// Example usage
// (async () => {
//   const uploadUrl = await generateUploadURL("details.txt", "text/txt");
//   console.log("Upload URL:", uploadUrl);

//   const downloadUrl = await generateDownloadURL("test.png");
//   console.log("Download URL:", downloadUrl);
// })();