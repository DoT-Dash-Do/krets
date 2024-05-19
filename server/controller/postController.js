import Comment from "../models/commentModel.js";
import Community from "../models/communityModel.js";
import Follower from "../models/followerModel.js";
import User from "../models/userModel.js";
import Like from "../models/likeModel.js";
import Post from "../models/postModel.js";
import { errorHandler } from "../utils/errorHandler.js";

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({})
      .populate({ path: "community", select: "communityName avatar" })
      .populate({ path: "user", select: "username" })
      .sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (error) {
    next(errorHandler(404, "server not responding"));
  }
};

export const getCommunityPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ community: req.params.id })
      .populate({ path: "community", select: "communityName avatar" })
      .populate({ path: "user", select: "username" })
      .sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (error) {
    next(errorHandler(404, "server not responding"));
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .populate({ path: "community", select: "communityName avatar" })
      .populate({ path: "user", select: "username" })
      .sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (error) {
    next(errorHandler(404, "server not responding"));
  }
};

export const deleteUserPost = async (req, res, next) => {
  const { token, postid } = req.body;
  try {
    const post = await Post.findById(postid);
    const comm = await Community.findById(post.community._id.toString());
    if (post.user._id.toString() !== req.user.id) {
      return next(errorHandler(501, "you can delete your own posts only"));
    }
    await Community.findByIdAndUpdate(
      post.community._id.toString(),
      {
        posts: comm.posts - 1,
      },
      { new: true }
    );
    await Post.findByIdAndDelete(postid);
    res.status(201).json({ message: "post deleted" });
  } catch (error) {
    console.log(error);
    return next(errorHandler(501, "error deleting post"));
  }
};

export const deleteAdminPost = async (req, res, next) => {
  const { token, postid, commId } = req.body;
  try {
    const community = await Community.findById(commId);
    if (community.admin._id.toString() !== req.user.id) {
      return next(errorHandler(501, "you are not the admin of this community"));
    }
    await Community.findByIdAndUpdate(
      commId,
      {
        posts: community.posts - 1,
      },
      { new: true }
    );
    await Post.findByIdAndDelete(postid);
    res.status(201).json({ message: "post deleted" });
  } catch (error) {
    return next(errorHandler(501, "error deleting post"));
  }
};

export const getUserFeed = async (req, res, next) => {
  const user = req.params.id;
  try {
    const Followings = await Follower.find({ user });
    var ans = [];
    for (let element of Followings) {
      var posts = await Post.find({ community: element.community._id })
        .populate({ path: "community", select: "communityName avatar" })
        .populate({ path: "user", select: "username" })
        .sort({ createdAt: -1 });
      ans.push(...posts);
    }
    return res.status(200).json(ans);
  } catch (error) {
    console.log(error);
    next(errorHandler(404, "server not responding"));
  }
};

export const postComment = async (req, res, next) => {
  const { comment, postId } = req.body;
  try {
    await Comment.create({
      user: req.user.id,
      post: postId,
      comment: comment,
    });
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { totalComments: 1 } },
      { new: true }
    );
    res.status(200).json(post);
  } catch (error) {
    next(errorHandler(404, "server not responding"));
  }
};

export const likePost = async (req, res, next) => {
  const { postId } = req.body;
  try {
    await Like.create({
      user: req.user.id,
      post: postId,
    });
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { totalLikes: 1 } },
      { new: true }
    );
    res.status(201).json(post);
  } catch (error) {
    next(errorHandler(404, "server not responding"));
  }
};

export const dislikePost = async (req, res, next) => {
  const { postId } = req.body;
  try {
    await Like.findOneAndDelete({
      user: req.user.id,
      post: postId,
    });
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { totalLikes: -1 } },
      { new: true }
    );
    console.log(post);
    res.status(201).json(post);
  } catch (error) {
    next(errorHandler(404, "server not responding"));
  }
};

export const showForUser = async (req, res, next) => {
  const { postId } = req.body;
  try {
    const post = await Post.findById(postId)
      .populate({ path: "community", select: "communityName avatar" })
      .populate({ path: "user", select: "username" });
    const comments = await Comment.find({ post: postId })
      .populate({ path: "user", select: "username avatar" })
      .sort({ createdAt: -1 });
    const likedByUser = await Like.find({ user: req.user.id, post: postId });
    res.status(200).json({
      post,
      comments,
      likedByUser,
    });
  } catch (error) {
    next(errorHandler(404, "server not responding"));
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate({ path: "user", select: "username avatar" })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    next(errorHandler(404, "server not responding"));
  }
};

export const searchQuery = async (req, res, next) => {
  const { search, stype } = req.body;
  try {
    if (stype === "Post") {
      const answer = await Post.find({
        title: { $regex: search, $options: "i" },
      })
        .populate({ path: "community", select: "communityName avatar" })
        .populate({ path: "user", select: "username" });
      return res.status(200).json(answer);
    } else if (stype === "Community") {
      const answer = await Community.find({
        communityName: { $regex: search, $options: "i" },
      });
      return res.status(200).json(answer);
    } else {
      const answer = await User.find({
        username: { $regex: search, $options: "i" },
      }).select("avatar username cover");
      res.status(200).json(answer);
    }
  } catch (error) {
    next(errorHandler(404, "server not responding"));
  }
};
