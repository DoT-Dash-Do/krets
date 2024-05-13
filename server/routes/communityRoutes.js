import express from 'express';
import { getCommunityDetails, getTenCommunities, getUserCommunities,getUserFollows,updateCommunity } from '../controller/communityController.js';
import authCheck from "../utils/authCheck.js";
const router = express.Router();

router.get("/getCommunityDetails/:id",getCommunityDetails);
router.post("/getUserCommunities",authCheck,getUserCommunities);
router.put("/updateCommunity",authCheck,updateCommunity)
router.get("/getTenCommunities",getTenCommunities);
router.get("/getUserFollows/:id",getUserFollows);
export default router;