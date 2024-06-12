import { Router } from "express";
import { asyncCatch } from "../utils/asynCatch.js";
import likeController from "../controller/listLikeModel.js";

const likeRoute = Router();

likeRoute.put("/:userId/:postId", asyncCatch(likeController.updateLikeList));

likeRoute.get("/:userId", asyncCatch(likeController.getLikeList));

likeRoute.get(
  "/check/:userId/:postId",
  asyncCatch(likeController.isInLikeList)
);

export default likeRoute;
