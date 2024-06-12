import { Router } from "express";
import { asyncCatch } from "../utils/asynCatch.js";
import authenController from "../controller/authenController.js";
import {
  emailPasswordValidate,
  loginValidate,
} from "../validate/validation.js";
import { middlewareToken } from "../controller/middlewareController.js";
import { uploader } from "../utils/uploader.js";

const authenRoute = Router();

authenRoute.post(
  "/register",
  uploader.single("file"),
  asyncCatch(authenController.userRegister)
);
authenRoute.post(
  "/login",
  asyncCatch(loginValidate),
  asyncCatch(authenController.userLogin)
);

authenRoute.post("/refresh", asyncCatch(authenController.requestRefToken));

authenRoute.post(
  "/logout",
  // asyncCatch(middlewareToken.verifyToken),
  asyncCatch(authenController.userLogout)
);

export default authenRoute;
