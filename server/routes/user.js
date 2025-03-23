import express from "express";
import userAuth from "../middlewares/auth.js";
import { getUserData } from "../controllers/user.js";

const router = express.Router();

router.get("/data", userAuth, getUserData);

export default router;
