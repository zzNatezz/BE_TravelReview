import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import authenRoute from "./routes/authenRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/userRoute.js";

dotenv.config();

const sv = express();

sv.use(express.json());
const corsOptions = {
  origin: "*",
  credentials: true,
};

sv.use(cors(corsOptions));

sv.use(morgan("combined"));
sv.use(cookieParser());

sv.use("/index", (req, res) => {
  res.status(200).send("Hello world");
});

sv.use("/v1/auth", authenRoute);
sv.use("/v1/user", userRoute);

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
