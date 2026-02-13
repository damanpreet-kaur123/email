import {
    forgotPassword,
    registerUser,
    resetPassword,
} from "../controllers/usercontrollers.js";

import express from "express";

const router = express.Router();

router.post("/register", registerUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
