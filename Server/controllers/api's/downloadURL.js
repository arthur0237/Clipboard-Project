import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../../config/s3Client.js"; // your configured S3Client
import dotenv from "dotenv";
dotenv.config();

async function generateDownloadURL(filename) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: filename,
    ResponseContentDisposition: `attachment; filename=${filename}`
// It’s an HTTP response header that tells the
// browser how it should handle the file. 

// inline → display in the browser tab if possible
// Content-Disposition: inline
// Example: PDFs, images, text files will open in the browser.

// attachment → force browser to download instead of opening
// Content-Disposition: attachment; filename=${filename}"

// Before: S3 just sent the file with no special
// instructions → browser thought “Oh, it’s text, 
// let me just show it in the tab.”

// After: With
// Content-Disposition: attachment; filename=details4.txt

// you told the browser “Don’t open 
// this — treat it as a downloadable 
// attachment with this filename.”

  });

  return await getSignedUrl(s3, command, { expiresIn: 60 });
}

 
export async function downloadURL(req, res){
  try {
    const { filename } = req.query;
    const url = await generateDownloadURL(filename);
    res.json({ url });
  } catch (err) {
    console.error("Error you was looking for :", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};