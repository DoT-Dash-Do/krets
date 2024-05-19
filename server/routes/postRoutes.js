import express from 'express';
import authCheck from '../utils/authCheck.js';
import {deleteUserPost, getAllPosts, getCommunityPosts, getUserPosts,deleteAdminPost, getUserFeed, postComment, likePost, dislikePost, showForUser, getComments, searchQuery} from '../controller/postController.js'
const router = express.Router();
router.get("/getCommunityPosts/:id",getCommunityPosts)
router.get("/getUserPosts/:id",getUserPosts)
router.get("/getAllPosts",getAllPosts);
router.get("/getUserFeed/:id",getUserFeed);
router.post("/deleteUserPost",authCheck,deleteUserPost);
router.post("/deleteAdminPost",authCheck,deleteAdminPost);
router.post("/postComment",authCheck,postComment);
router.post("/likePost",authCheck,likePost);
router.post("/dislikePost",authCheck,dislikePost);
router.post("/getSinglePost",authCheck,showForUser);
router.get("/getComments/:id",getComments);
router.post("/search",searchQuery);
export default router;