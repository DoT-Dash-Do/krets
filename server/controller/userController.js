import Community from "../models/communityModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import Follower from "../models/followerModel.js";

export const createCommunity = async (req, res, next) => {
  const { token, ...rest } = req.body;
  try {
    await Community.create({ ...rest, admin: req.user.id });
    res.status(201).json({ message: "community created successfully" });
  } catch (error) {
    next(errorHandler(409, "community Name already exists"));
  }
};

export const createPost = async (req, res, next) => {
  const { token, ...rest } = req.body;
  try {
    const comm = await Community.findById(rest.community);
    await Community.findByIdAndUpdate(rest.community,{
      posts:comm.posts+1
    },{new:true});
    await Post.create({ ...rest, user: req.user.id });
    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    next(errorHandler(510, "not able to create communtiy"));
  }
};

export const updateUser = async (req, res, next) => {
  const { token, ...rest } = req.body;
  try {
    const response = await User.findByIdAndUpdate(req.user.id, rest, {
      new: true,
    });
    const { password: pass, ...userinfo } = response._doc;
    res.status(200).json(userinfo);
  } catch (error) {
    next(errorHandler(550, "unauthorized changes"));
  }
};

export const UserProfile = async (req, res, next) => {
  const { id } = req.params;
  try {
    const validU = await User.findById(id);
    const { password: pass, ...rest } = validU._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(errorHandler(401, "cant find user"));
  }
};

export const changePassword = async (req, res, next) => {
  const { oldpassword, password, cpassword } = req.body;
  try {
    const getPass = await User.findById(req.user.id).select("password");
    const passCheck = bcrypt.compareSync(oldpassword, getPass.password);
    if (!passCheck) {
      return next(errorHandler(500, "please check your old password"));
    }
    const newPassCheck = bcrypt.compareSync(password, getPass.password);
    if (newPassCheck) {
      return next(errorHandler(501,"new password should not be same as your old password"))
    }
    const hashedPassword = bcrypt.hashSync(password,10);
    await User.findByIdAndUpdate(req.user.id, { password:hashedPassword }, { new: true });
    res.status(201).json({ message: "password updated" });
  } catch (error) {
    console.log(error);
    next(errorHandler(550, "not able to complete request"));
  }
};

export const follow = async(req,res,next) => {
  const {communityId} = req.body;
  try {
    const community = await Community.findById(communityId);
    Follower.create({
      user:req.user.id,
      community:communityId
    })
    await Community.findByIdAndUpdate(
      communityId,
      {
        followers: community.followers + 1,
      },
      { new: true }
    );
    res.status(200).json({message:"community followed"})
  } catch (error) {
    next(errorHandler(550, "not able to follow"));
  }
}

export const unfollow = async(req,res,next) => {
  const {communityId} = req.body;
  try {
    const community = await Community.findById(communityId);
    const check = await Follower.findOneAndDelete({
      user:req.user.id,
      community:communityId
    })
    await Community.findByIdAndUpdate(
      communityId,
      {
        followers: community.followers - 1,
      },
      { new: true }
    );
    res.status(200).json({message:"community unfollowed"})
  } catch (error) {
    next(errorHandler(550, "not able to follow"));
  }
}

export const checkfollow = async(req,res,next) => {
  const {communityId} = req.body;
  try {
     const check = await Follower.findOne({
      user:req.user.id,
      community:communityId
    })
    res.status(200).json({check})
  } catch (error) {
    next(errorHandler(550, "not able to follow"));
  }
}
