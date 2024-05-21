import mongoose from "mongoose";
import { userModel } from "./userModel.js";

const postSchema = new mongoose.Schema({
  manWhoCreate: {
    type: mongoose.Types.ObjectId,
    ref: userModel,
  },
  createAt: { type: Date, default: Date.now },
  isPublic: { type: Boolean, default: true },
  updateAt: Date,
  content: { type: String, require: true },
  image: {
    url: String,
    publicId: String,
  },
});

const postModel = mongoose.model("post", postSchema);

export { postModel };
