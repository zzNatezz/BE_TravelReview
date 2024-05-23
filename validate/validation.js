import { isObjectIdOrHexString } from "mongoose";
import validator from "validator";

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

export const postContentValidate = (req, res, next) => {
  const { userId } = req.params;
  const { content } = req.body;
  if (!userId) throw new Error("You are not authenticated");
  if (!content) throw new Error("The content is required");
  if (!isObjectIdOrHexString(userId)) throw new Error("User is invalid");
  next();
};
