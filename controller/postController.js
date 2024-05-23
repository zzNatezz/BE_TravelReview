import { postModel } from "../model/postModel.js";
import { cloudinary } from "../utils/uploader.js";

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

  // get all post
  allPosts: async (req, res) => {
    const posts = await postModel.find().populate("manWhoCreate");
    res.status(200).send(posts);
  },

  //get post with user id
  getPostWithId: async (req, res) => {
    const userId = req.params.userId;
    const user = await postModel
      .findOne({ manWhoCreate: userId })
      .populate("manWhoCreate");
    res.send(user);
  },
};

export default postController;
