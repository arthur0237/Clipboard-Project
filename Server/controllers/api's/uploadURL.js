import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../../config/s3Client.js"; // your configured S3Client
import dotenv from "dotenv";
dotenv.config();


async function generateUploadURL(filename, contentType) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: filename,
    ContentType: contentType,
  });

  // create presigned URL
  const url = await getSignedUrl(s3, command, { expiresIn: 300 });
  return url;
}

// app.get("/get-upload-url", 
export async function uploadURL(req, res){
try{
  const { filename, contentType } = req.query;

  const url = await generateUploadURL(filename, contentType);

  res.json({ url }); // send it back to frontend
}catch(err){
    console.error("Error developers looks for: ",err);
    res.status(500).json({error: "Internal server error"})
}
};