import express from "express";
import dotenv from "dotenv";

const router = express.Router();

dotenv.config();

router.get("/config", (req, res) => {
  return res.status(200).json({
    status: "OK",
    data: process.env.CLIENT_ID,
  });
});

export default router;
