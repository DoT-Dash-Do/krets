import mongoose from "mongoose";

const followerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  },
  { timestamps: true }
);

const Follower = mongoose.model("Follower", followerSchema);

export default Follower;
