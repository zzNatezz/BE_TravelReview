import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  userName: { type: String, require: true },
  avatar: { type: String || null },
  admin: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
  updateAt: Date,
  status: Boolean,
});

const userModel = mongoose.model("user", userSchema);

export { userModel };
