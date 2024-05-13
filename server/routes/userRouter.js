import express from 'express';
import authCheck from '../utils/authCheck.js';
import { changePassword, checkfollow, createCommunity, createPost, follow, unfollow, updateUser } from '../controller/userController.js';
import { UserProfile } from '../controller/userController.js';
const router = express.Router();

router.post("/createCommunity",authCheck,createCommunity);
router.post("/createPost",authCheck,createPost);
router.put("/updateUser",authCheck,updateUser);
router.put("/changePassword",authCheck,changePassword);
router.get("/getUserProfile/:id",UserProfile);
router.post("/follow",authCheck,follow);
router.post("/unfollow",authCheck,unfollow);
router.post("/checkFollow",authCheck,checkfollow);

export default router;