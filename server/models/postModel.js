import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    community:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Community'
    },
    title: {
        type: String,
        default: "",
      },
    description: {
      type: String,
      default: "",
    },
    media: {
      type: [
        {
          Type: String,
          Link: String,
        },
      ],
      default: [],
    },
    totalLikes:{
        type:Number,
        default:0
    },
    totalComments:{
        type:Number,
        default:0
    }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;