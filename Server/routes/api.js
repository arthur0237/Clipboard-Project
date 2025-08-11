import { Router } from "express"

import { downloadURL } from "../controllers/api's/downloadURL.js";
import { uploadURL } from "../controllers/api's/uploadURL.js";
import { deleteFromS3 } from "../cintroller/api's/deleteFromS3.js";


const router = Router();

router.post('/content', uploadURL);

router.get('/content', downloadURL);

router.delete('/content', deleteFromS3);


export default router;