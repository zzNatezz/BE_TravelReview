import { isObjectIdOrHexString } from "mongoose";
import { commentModel } from "../model/commetModel.js";

const commentController = {
  postComment: async (req, res) => {
    const { userId, postId } = req.params;
    const comment = req.body.comment;
    const post = await commentModel.updateOne(
      { post: postId },
      {
        $push: {
          comment: {
            userId,
            comment,
          },
        },
      }
    );
    res.status(200).send("Comment successfully !!!");
  },
  allCommentInPost: async (req, res) => {
    const postId = req.params.postId;
    if (!isObjectIdOrHexString(postId))
      throw new Error("Somethings went wrong !!!");
    const comments = await commentModel
      .findOne({ post: postId })
      .populate({ path: "comment", populate: { path: "userId" } });
    if (!comments) throw new Error("Post is unavailable now !!! ");
    res.status(200).send(comments);
  },
};

export default commentController;
