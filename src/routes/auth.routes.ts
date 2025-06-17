import express from "express";
import {
    getMe,
    login,
    logout,
    protect,
    signup,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
