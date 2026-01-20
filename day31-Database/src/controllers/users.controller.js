import { sendError } from "../utils/sendError.js";
import { UserModel } from "../models/User.js";

const getUser = async (req, res) => {
    const userId = req.userId;
    if (!userId) return sendError(res, 400, "Unauthenticated");


    const user = await UserModel.findOne({ _id : userId });
    if (!user) {
        return sendError(res, 404, "User Not Found");
    }

    return res.status(200).json({
        success: true,
        message: "user found",
        user
    });
};

const getAllUsers = async (req,res) => {
    const page = Number(req.query.page) || 2;
    const limit = Number(req.query.limit) || 2;
    const skip = (page-1) * limit;
    const allUsers = await UserModel.find({})
    .skip(skip)
    .limit(limit)
    .sort({createdAt : 1});
    return res.status(200).json({
        success : true,
        message : "all user here",
        allUsers
    })
}

const deleteUser = async (req, res) => {
    const userId = req.params.id;

    const result = await UserModel.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
        return sendError(res, 404, "User not found");
    }
    res.status(200).json({
        success: true,
        message: "User Deleted"
    });
};

export { getUser, deleteUser, getAllUsers };