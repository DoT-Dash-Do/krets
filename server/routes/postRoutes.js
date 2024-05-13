import express from 'express';
import authCheck from '../utils/authCheck.js';
import {deleteUserPost, getAllPosts, getCommunityPosts, getUserPosts,deleteAdminPost, getUserFeed} from '../controller/postController.js'
const router = express.Router();
router.get("/getCommunityPosts/:id",getCommunityPosts)
router.get("/getUserPosts/:id",getUserPosts)
router.get("/getAllPosts",getAllPosts);
router.get("/getUserFeed/:id",getUserFeed);
router.post("/deleteUserPost",authCheck,deleteUserPost);
router.post("/deleteAdminPost",authCheck,deleteAdminPost);
export default router;