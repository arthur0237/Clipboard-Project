import { Router } from "express";

const router = Router();

router.get("/send_file",(req,res)=>{
  res.send(200);
})

export default router;