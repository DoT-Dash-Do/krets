import express from 'express';
import { login, signup, verifyEmail } from '../controller/authController.js';
const router = express.Router();

router.post("/signup",signup);
router.get("/verify-mail/:chk",verifyEmail);
router.post("/login",login)
export default router;