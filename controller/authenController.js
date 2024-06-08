import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userModel } from "../model/userModel.js";
import { cloudinary } from "../utils/uploader.js";

let fakeDataRefreshToken = [];

const authenController = {
  userRegister: async (req, res) => {
    const { userName, email, password } = req.body;
    if (!userName) throw new Error("Please fill your name");
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const date = new Date();
    date.setHours(date.getHours() + 7);
    const isoDate = date.toISOString();
    const file = req.file;
    if (!file) {
      await userModel.create({
        userName: userName,
        email: email,
        password: hashed,
        createAt: isoDate,
        avatar: {
          url: "",
          publicId: "",
        },
      });
      res.status(200).send("Register successfully");
    } else {
      const typefile = file.mimetype.split("/")[0];
      if (typefile !== "image") throw new Error("Only image type is accepted");
      const dataUrl = `data:${file.mimetype};base64,${file.buffer?.toString(
        "base64"
      )}`;
      const fileName = file.originalname.split(".")[0];
      const uploaded = await cloudinary.uploader.upload(dataUrl, {
        public_id: fileName,
        resource_type: "image",
      });

      const secureUrl = uploaded.secure_url;
      const publicId = uploaded.public_id;

      await userModel.create({
        userName: userName,
        email: email,
        password: hashed,
        createAt: isoDate,
        avatar: {
          url: secureUrl,
          publicId,
        },
      });
      res.status(200).send("Register successfully");
    }
  },

  generateAccessToken: (user) => {
    return jwt.sign({ user }, process.env.JWT_ACCESS_KEY, {
      expiresIn: "10s",
    });
  },
  generateRefToken: (user) => {
    return jwt.sign({ user }, process.env.JWT_REFERSH_KEY, {
      expiresIn: "30d",
    });
  },

  userLogin: async (req, res) => {
    const { email, password } = req.body;
    const findUser = await userModel.findOne({ email: email });
    if (!findUser) throw new Error("email or password is incorrect !!!");

    const isPassword = await bcrypt.compare(password, findUser.password);
    if (!isPassword) throw new Error("email or password is incorrect !!!");

    findUser.password = undefined;

    const accessToken = authenController.generateAccessToken(findUser);

    const refToken = authenController.generateRefToken(findUser);
    fakeDataRefreshToken.push(refToken);
    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    };

    res.status(200).cookie("refToken", refToken, options);

    res.status(200).send(accessToken);
  },

  requestRefToken: async (req, res) => {
    const refToken = req.cookies.refToken;
    if (!refToken) {
      return res.status(401).send("refToken is authenticated");
    } //<-- Đây là lỗi mà browser đang báo
    if (!fakeDataRefreshToken.includes(refToken))
      throw new Error("Token is invalid");
    jwt.verify(refToken, process.env.JWT_REFERSH_KEY, (err, user) => {
      if (err) throw new Error("Token is invalid");
      fakeDataRefreshToken = fakeDataRefreshToken.filter(
        (token) => token !== refToken
      );
      const newAccesstoken = authenController.generateAccessToken(user);
      const newRefToken = authenController.generateRefToken(user);
      fakeDataRefreshToken.push(newRefToken);
      const options = {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      };
      res.cookie("refToken", newRefToken, options);
      res.status(200).send({ new_access_token: newAccesstoken });
    });
  },

  userLogout: async (req, res) => {
    res.clearCookie("refToken");
    fakeDataRefreshToken = fakeDataRefreshToken.filter(
      (token) => token !== req.cookies.refToken
    );
    res.send("Logged out successfully !!");
  },
};

export default authenController;
