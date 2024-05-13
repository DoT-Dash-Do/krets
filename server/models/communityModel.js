import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    communityName: {
      type: String,
      required: true,
      unique: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    about: {
      type: String,
      default: "",
    },
    links: {
      type: [
        {
          Name: String,
          Link: String,
        },
      ],
      default: [],
    },
    rules: {
      type: [String],
      default: [],
    },
    followers: {
      type: Number,
      default: 0,
    },
    posts: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default: "",
    },
    cover: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

const Community = mongoose.model("Community", communitySchema);

export default Community;
