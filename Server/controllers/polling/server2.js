// here we are triggering the download of
// the file which is most recent on S3
// via presigned-url.

import { downloadFile } from "../../public_start/download.js"

export async function triggeringDownload(req, res){
  const result = await downloadFile(req.body.fileName);
  res.json(result);
};