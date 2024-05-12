import validator from "validator";

export const emailPasswordValidate = async (req, res, next) => {
  const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number:
  const { email, password } = req.body;
  const isPasswordType = regexPass.test(password);
  if (!validator.isEmail(email)) throw new Error("Email is invalid");
  if (!isPasswordType) throw new Error("Password is incorrect type");
  console.log(isPasswordType);
  next();
};
