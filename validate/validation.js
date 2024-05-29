import { isObjectIdOrHexString } from "mongoose";
import validator from "validator";
import { userModel } from "../model/userModel.js";

export const emailPasswordValidate = async (req, res, next) => {
  const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number:

  const { email, password, userName } = req.body;
  const validateEmail = validator.isEmail(email);

  const isPasswordType = regexPass.test(password);

  if (!validateEmail) throw new Error("Email is invalid");

  if (!isPasswordType) throw new Error("Password is incorrect type");

  if (!userName) throw new Error("Please let me know you name");
  next();
};

export const postContentValidate = async (req, res, next) => {
  const { userId } = req.params;
  const { content } = req.body;
  if (!userId) throw new Error("You are not authenticated");
  const isUser = await userModel.findById(userId);
  if (!isUser) throw new Error("User was removed !!!!");
  if (!content) throw new Error("The content is required");
  if (!isObjectIdOrHexString(userId)) throw new Error("User is invalid");
  next();
};

export const authenUserValidate = (req, res, next) => {
  const { userId, postId } = req.params;
  if (!userId) throw new Error("please login");
  if (!postId) throw new Error(" Post has been removed !!! ");
  next();
};
