import Community from "../models/communityModel.js";
import Follower from "../models/followerModel.js";
import { errorHandler } from "../utils/errorHandler.js";

export const getCommunityDetails = async (req, res, next) => {
  const { id } = req.params;
  try {
    const details = await Community.findById(id).populate({
      path: "admin",
      select: "username avatar",
    });
    res.status(201).json(details);
  } catch (error) {
    next(errorHandler(404, "not found"));
  }
};

export const getUserCommunities = async (req, res, next) => {
  try {
    const communities = await Community.find({ admin: req.user.id });
    res.status(201).json(communities);
  } catch (error) {
    next(errorHandler(404, "not found"));
  }
};

export const updateCommunity = async (req, res, next) => {
  const { commId, token, formData } = req.body;
  try {
    const community = await Community.findById(commId);
    if (req.user.id !== community.admin.toString()) {
      return next(errorHandler(550, "you can edit communities created by you"));
    }
    await Community.findByIdAndUpdate(commId,{...formData},{new:true});
    res.status(200).json({message:"Community has been updated"});
  } catch (error) {
    next(errorHandler(550, "internal server error"));
  }
};

export const getTenCommunities = async(req,res,next) => {
  try {
    const communities = await Community.find({}).select("avatar cover communityName").sort({totalFollowers:-1}).limit(7);
    res.status(200).json(communities);
  } catch (error) {
    next(errorHandler(404,"server not responding"));
  }
}

export const getUserFollows = async(req,res,next) => {
  try {
    const communities = await Follower.find({user:req.params.id}).populate({ path: "community", select: "communityName avatar" });
    res.status(200).json(communities);
  } catch (error) {
    next(errorHandler(404,"server not responding"));
  }
}
