import { Router } from "express";
import { asyncCatch } from "../utils/asynCatch.js";
import postController from "../controller/postController.js";
import { postContentValidate } from "../validate/validation.js";
import { uploader } from "../utils/uploader.js";
import { middlewareToken } from "../controller/middlewareController.js";

const postRoute = Router();

postRoute.post(
  "/:userId",
  uploader.single("file"),
  // asyncCatch(middlewareToken.verifyToken),
  asyncCatch(postContentValidate),
  asyncCatch(postController.uploadContent)
);

postRoute.get("/", asyncCatch(postController.allPosts));
postRoute.get("/:postId", asyncCatch(postController.getPostWithId));
postRoute.put(
  "/:postId/:userId",
  uploader.single("file"),
  // asyncCatch(middlewareToken.verifyToken),
  asyncCatch(postController.updateImage)
);

postRoute.delete(
  "/:userId/:postId",
  // asyncCatch(middlewareToken.verifyToken),
  asyncCatch(postController.removedPost)
);
postRoute.put(
  "/string/:userId/:postId",
  // asyncCatch(middlewareToken.verifyToken),
  asyncCatch(postController.updateContent)
);
postRoute.put("/file/:userId/:postId", asyncCatch(postController.updateImage));

export default postRoute;
