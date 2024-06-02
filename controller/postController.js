import { isObjectIdOrHexString } from "mongoose";
import { postModel } from "../model/postModel.js";
import { cloudinary } from "../utils/uploader.js";
import { commentModel } from "../model/commetModel.js";

const postController = {
  uploadContent: async (req, res) => {
    const { userId } = req.params;
    const { content, isPublic } = req.body;
    const file = req.file;
    const date = new Date();
    date.setHours(date.getHours() + 7);
    const isoDate = date.toISOString();
    if (!file) {
      const createPost = await postModel.create({
        manWhoCreate: userId,
        isPublic: isPublic === undefined ? true : isPublic,
        content: content,
        image: {
          url: "",
          publicId: "",
        },
        createAt: isoDate,
      });
      await createPost.save();
      await commentModel.create({
        post: createPost._id,
        comment: [],
      });

      res.status(200).send(createPost);
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

      const createPost = await postModel.create({
        manWhoCreate: userId,
        isPublic: isPublic === undefined ? true : isPublic,
        content: content,
        image: {
          url: secureUrl,
          publicId,
        },
        createAt: isoDate,
      });
      await createPost.save();
      await commentModel.create({
        post: createPost._id,
        comment: [],
      });
      res.status(200).send(createPost);
    }
  },
  //only update image
  updateImage: async (req, res) => {
    const file = req.file;
    const typefile = file.mimetype.split("/")[0];
    if (typefile !== "image") throw new Error("Only image type is accept");
    const { userId, postId } = req.params;
    const dataUrl = `data:${file.mimetype};base64,${file.buffer?.toString(
      "base64"
    )}`;
    const fileName = file.originalname.split(".")[0];
    const post = await postModel.findById(postId);
    if (userId !== post.manWhoCreate.toString())
      throw new Error("You do not owned this post");
    await cloudinary.uploader.destroy(post.image.publicId);
    const updateImage = await cloudinary.uploader.upload(dataUrl, {
      public_id: fileName,
      resource_type: "image",
    });
    post.image.publicId = updateImage.public_id;
    post.image.url = updateImage.secure_url;
    post.save();
    res.status(201).send("Image has been updated");
  },

  //only update content in post
  updateContent: async (req, res) => {
    const { userId, postId } = req.params;
    const { content } = req.body;
    if (!isObjectIdOrHexString(userId) || !isObjectIdOrHexString(postId))
      throw new Error("Please check post Id and user Id");
    if (!userId) throw new Error("Please login first");
    if (!postId)
      throw new Error(`Can't update because something went wrong with post`);
    const postUpdated = await postModel.findByIdAndUpdate(postId, content);
    if (!postUpdated)
      throw new Error("Post was removed, can not update the content ");
    res.status(201).send("Post has been updated");
  },

  // get all post
  allPosts: async (req, res) => {
    const posts = await postModel
      .find()
      .populate("manWhoCreate")
      .sort({ createAt: -1 });
    res.status(200).send(posts);
  },

  //get post with user id
  getPostWithId: async (req, res) => {
    const { postId } = req.params;
    if (!isObjectIdOrHexString(postId))
      throw new Error("The post has been deleted");
    const post = await postModel.findById(postId).populate("manWhoCreate");
    if (!post) throw new Error(`Can't find the post`);
    res.status(200).send(post);
  },

  //removePost
  removedPost: async (req, res) => {
    const { userId, postId } = req.params;
    if (!isObjectIdOrHexString(userId) || !isObjectIdOrHexString(postId))
      throw new Error("Please check postId and userId");
    if (!userId) throw new Error("Please login first");
    if (!postId)
      throw new Error(`Can't removed because something went wrong with post`);
    const postRemoved = await postModel.findByIdAndDelete(postId);
    if (!postRemoved)
      throw new Error("Please reload page because the post was removed");
    const commentRemoved = await commentModel.findOneAndDelete({
      post: postId,
    });
    if (!commentRemoved)
      throw new Error("Please reload page because the post was removed");
    res.status(200).send("Removed successfully");
  },
};

export default postController;
