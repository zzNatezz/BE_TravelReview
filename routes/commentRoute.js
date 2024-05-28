import { Router } from "express";
import { asyncCatch } from "../utils/asynCatch.js";
import commentController from "../controller/commentController.js";
import { authenUserValidate } from "../validate/validation.js";

const commentRoute = Router();

commentRoute.post(
  "/:userId/:postId",
  asyncCatch(authenUserValidate),
  asyncCatch(commentController.postComment)
);

commentRoute.get("/:postId", asyncCatch(commentController.allCommentInPost));

export default commentRoute;
