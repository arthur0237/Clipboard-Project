import { Router } from "express"
import { pollingToServer } from "../controllers/polling/server.js"
import { triggeringDownload } from "../controllers/polling/server2.js"

const router = Router();

// url to check the if there is any update in the AWS-S3
router.get('/check-update', pollingToServer);

router.post('/trigger', triggeringDownload)

export default router;