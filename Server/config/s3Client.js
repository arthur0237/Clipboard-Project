import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();


const s3 = new S3Client({
  region: "eu-north-1",   // e.g. "us-east-1"
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,   // from IAM user
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  }
});

export default s3;
