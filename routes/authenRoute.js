import { Router } from "express";
import { asyncCatch } from "../utils/asynCatch.js";
import authenController from "../controller/AuthenController.js";
import { emailPasswordValidate } from "../validate/validation.js";

const authenRoute = Router();

authenRoute.post(
  "/register",
  asyncCatch(emailPasswordValidate),
  authenController.userRegister
);
authenRoute.post("/login", asyncCatch(authenController.userLogin));

export default authenRoute;
