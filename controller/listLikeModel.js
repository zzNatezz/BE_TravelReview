import listlikePost from "../model/likePostModel.js";

const likeController = {
  updateLikeList: async (req, res) => {
    const { userId, postId } = req.params;
    const owner = await listlikePost.findOne({ owner: userId });
    const isLike = owner.listLike.includes(postId);
    if (!isLike) {
      await listlikePost.findOneAndUpdate(
        { owner: userId },
        { $push: { listLike: postId } }
      );
      res.status(201).send("Push successfully !!!");
    } else {
      await listlikePost.findOneAndUpdate(
        { owner: userId },
        { $pull: { listLike: postId } }
      );
      res.status(200).send("Pull successfully !!!");
    }
  },
  getLikeList: async (req, res) => {
    const { userId } = req.params;
    const listLike = await listlikePost.find({ owner: userId });
    res.status(200).send(listLike.listLike);
  },
  isInLikeList: async (req, res) => {
    const { userId, postId } = req.params;
    const posts = await listlikePost.findOne({ owner: userId });
    console.log(posts);
    const isExist = posts.listLike.includes(postId);
    res.status(200).send(isExist);
  },
};

export default likeController;
