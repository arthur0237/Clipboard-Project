import { Router } from "express"

// import { downloadURL } from "../controllers/api's/downloadURL.js";
import { generateUploadURL } from "../url_test.js"; 
// import { deleteFromS3 } from "../controller/api's/deleteFromS3.js";


const router = Router();

router.get('/get-upload-url', generateUploadURL);

// router.get('/content', downloadURL);

// router.delete('/content', deleteFromS3);


export default router;