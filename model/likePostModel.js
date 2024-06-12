import mongoose from "mongoose";
import { postModel } from "./postModel.js";
import { userModel } from "./userModel.js";

const likePost = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: userModel,
  },
  listLike: [
    {
      type: mongoose.Types.ObjectId,
      ref: postModel,
    },
  ],
  isLike: { type: Boolean, default: true },
});

const listlikePost = mongoose.model("listLike", likePost);

export default listlikePost;
