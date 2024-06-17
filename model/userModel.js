import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  userName: { type: String, require: true },
  avatar: { type: String || null },
  admin: { type: Boolean, default: false },
  createAt: Date,
  updateAt: Date,
  status: Boolean,
  avatar: {
    url: String,
    publicId: String,
  },
});

userSchema.index({ userName: "text" });

const userModel = mongoose.model("user", userSchema);

userModel.createIndexes();

export { userModel };
