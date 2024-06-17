import { userModel } from "../model/userModel.js";

const userController = {
  getAllUser: async (req, res) => {
    const users = await userModel.find();
    res.status(200).json(users);
  },
  getUser: async (req, res) => {
    const userId = req.params.id;
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User is invalid");
    res.status(200).send(user);
  },
  userFinding: async (req, res) => {
    const { keyword } = req.params;
    const users = await userModel.find({ $text: { $search: keyword } });
    const resultUserObj = users.map((item) => ({
      userName: item.userName,
      avatar: item.avatar,
    }));
    res.status(200).send(resultUserObj);
  },
};

export default userController;
