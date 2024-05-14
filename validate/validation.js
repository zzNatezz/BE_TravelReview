import validator from "validator";

export const emailPasswordValidate = async (req, res, next) => {
  const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number:

  const { email, password } = req.body;
  const validateEmail = validator.isEmail(email);

  const isPasswordType = regexPass.test(password);
  console.log("isPasswordType ==>", isPasswordType);

  if (!validateEmail) throw new Error("Email is invalid");
  console.log("validateEmail ==>", validateEmail);

  if (!isPasswordType) throw new Error("Password is incorrect type");
  next();
};
