import mongoose from "mongoose";
import { postModel } from "./postModel.js";
import { userModel } from "./userModel.js";

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Types.ObjectId,
    ref: postModel,
  },
  comment: [
    {
      userId: {
        type: mongoose.Types.ObjectId,
        ref: userModel,
      },
      comment: String,
    },
  ],
});

const commentModel = mongoose.model("comments", commentSchema);

export { commentModel };
