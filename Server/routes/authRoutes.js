// this file will contain all the authenticated routes

import { Router } from "express";
import { showEmail } from "../controllers/show-email.js";

const router = Router();

router.get('/show-email', showEmail);

export default router;