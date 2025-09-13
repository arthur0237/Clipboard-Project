import { Router } from "express"

import { downloadURL } from "../controllers/api's/downloadURL.js";
import { uploadURL } from "../controllers/api's/uploadURL.js"; 
// import { deleteFromS3 } from "../controller/api's/deleteFromS3.js";


const router = Router();

// router.get('/content', uploadURL);
router.get('/get-upload-url', uploadURL);

// router.get('/content', downloadURL);
router.get('/get-download-url', downloadURL);

// router.delete('/content', deleteFromS3);


export default router;