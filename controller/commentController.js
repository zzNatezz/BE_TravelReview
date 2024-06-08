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
  editComment: async (req, res) => {
    const { userId, commentId, postId } = req.params;
    const { content } = req.body;
    if (!isObjectIdOrHexString(userId) || !isObjectIdOrHexString(commentId))
      throw new Error("Please check post Id and user Id");
    if (!userId) throw new Error("Please login first");
    if (!commentId)
      throw new Error(`Can't update because something went wrong with post`);
    const post = await commentModel
      .findOne({ post: postId })
      .populate({ path: "comment", populate: { path: "userId" } });
    if (!post)
      throw new Error(
        "Comment was removed, can not update the content Or you do not own the comment"
      );
    const comment = post.comment.find((item) => (item._id = commentId));
    comment.comment = content;
    await post.save();
    res.status(201).send("Comment has been updated");
  },

  removeComment: async (req, res) => {
    const { userId, commentId, postId } = req.params;
    if (!isObjectIdOrHexString(userId) || !isObjectIdOrHexString(commentId))
      throw new Error("Please check post Id and user Id");
    if (!userId) throw new Error("Please login first");
    if (!commentId) throw new Error(`Comment may be removed`);

    const post = await commentModel.findOne({ post: postId });

    if (!post) throw new Error("Post has been removed");

    const getComment = post.comment.find((item) => (item._id = commentId));

    const remainItems = post.comment.filter(
      (remainItem) => remainItem._id !== getComment._id
    );
    post.comment = remainItems;
    await post.save();
    res.status(201).send("The removal successfully");
  },

  quantitieComment: async (req, res) => {
    const { postId } = req.params;
    const post = await commentModel.findOne({ post: postId });
    if (!post) throw new Error("Post was removed");
    const quantitesComment = post.comment.length;
    res.status(200).send({ quantitesComment });
  },
};

export default commentController;
