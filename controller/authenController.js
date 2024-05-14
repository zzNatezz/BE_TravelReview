import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userModel } from "../model/userModel.js";

const authenController = {
  userRegister: async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    await userModel.create({
      firstName: firstName || "",
      lastName: lastName || "",
      phoneNumber: phoneNumber || "",
      email: email,
      password: hashed,
    });
    res.status(200).send("Register successfully");
  },
  userLogin: async (req, res) => {
    const { email, password } = req.body;
    console.log(typeof email);
    const findUser = await userModel.findOne({ email: email });
    console.log(findUser);
    if (!findUser) throw new Error("email or password is incorrect !!!");
    const isPassword = await bcrypt.compare(password, findUser.password);
    if (!isPassword) throw new Error("email or password is incorrect !!!");
    const payload = {
      id: findUser._id,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      phoneNumber: findUser.phoneNumber,
      admin: findUser.admin,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
      expiresIn: "1d",
    });
    res.status(200).status(`testing`);
  },
};

export default authenController;
