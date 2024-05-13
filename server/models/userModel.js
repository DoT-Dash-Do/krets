import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified:{
      type:Boolean,
      default:false
    },
    about: {
      type: String,
      default: "",
    },
    userLinks: {
      type: [
        {
          Name: String,
          Link: String,
        },
      ],
      default: [],
    },
    avatar: {
      type: String,
      default:"",
    },
    cover: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
