import express from "express";
import {
    getMe,
    login,
    logout,
    protect,
    signup,
} from "../controllers/auth.controller";

const router = express.Router();

router.use("/signup", signup);
router.use("/login", login);
router.use("/logout", logout);
router.use("/me", protect, getMe);

export default router;
