import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import authenRoute from "./routes/authenRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";

import commentRoute from "./routes/commentRoute.js";
import likeRoute from "./routes/isLikeRoute.js";

dotenv.config();

const sv = express();

sv.use(express.json());
const corsOptions = {
  origin: ["http://localhost:3000", "https://travel-review-web.vercel.app", 'http://localhost:54735'],
  credentials: true,
};

sv.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

sv.use(cors(corsOptions));

sv.use(morgan("combined"));
sv.use(cookieParser());

sv.use("/index", (req, res) => {
  res.status(200).send("Hello world");
});

sv.use("/v1/auth", authenRoute);
sv.use("/v1/user", userRoute);
sv.use("/v1/content", postRoute);
sv.use("/v1/comment", commentRoute);
sv.use("/v1/like", likeRoute);

mongoose
  .connect(process.env.MONGODB)
  .then(() =>
    sv.listen(process.env.PORT, () =>
      console.log(
        `server port http://localhost:${process.env.PORT} is running !!!`
      )
    )
  );

export default sv;
