import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  firstName: String,
  lastName: String,
  phoneNumber: String,
  avatar: { type: String || null },
  admin: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
  updateAt: Date,
  status: Boolean,
});

const userModel = mongoose.model("User", userSchema);

export { userModel };
