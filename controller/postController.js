import { postModel } from "../model/postModel.js";
import { cloudinary } from "../utils/uploader.js";

const postController = {
  uploadContent: async (req, res) => {
    const { userId } = req.params;
    const { content, isPublic } = req.body;
    const file = req.file;
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
      image: !file
        ? {
            url: "",
            publicId: "",
          }
        : {
            url: secureUrl,
            publicId,
          },
    });
    res.status(200).send(createPost);
  },
  //
  allPosts: async (req, res) => {
    const posts = await postModel.find().populate("manWhoCreate");
    res.status(200).send(posts);
  },
  getPostWithId: async (req, res) => {
    const userId = req.params.userId;
    const user = await postModel
      .findOne({ manWhoCreate: userId })
      .populate("manWhoCreate");
    res.send(user);
  },
};

export default postController;
