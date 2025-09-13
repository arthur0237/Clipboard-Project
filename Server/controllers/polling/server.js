import s3 from "../../config/s3Client.js";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import path from "path";
import dotenv from "dotenv";
dotenv.config();


const BUCKET = process.env.S3_BUCKET;
  
// Track last known timestamp 
// -initially it is set to null.2
let lastModifiedTime = null;

export async function pollingToServer(req, res) {
  try {
    const list = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }));

    if (!list.Contents || list.Contents.length === 0) {
      return res.json({ newFile: false });
    }

    const latest = list.Contents.sort(
      (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
    )[0];

    const currentModifiedTime = new Date(latest.LastModified).getTime();

    if (lastModifiedTime === null || currentModifiedTime > lastModifiedTime) {
      lastModifiedTime = currentModifiedTime;

      // gives filename along with extension 
      const fileName = path.basename(latest.Key);

      return res.json({
        newFile: true,
        fileName,
      });
    }

    return res.json({ newFile: false });

  } catch (err) {
    if (err.code === "NotFound") {
      return res.json({ newFile: false });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
