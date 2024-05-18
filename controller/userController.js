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
};

export default userController;
