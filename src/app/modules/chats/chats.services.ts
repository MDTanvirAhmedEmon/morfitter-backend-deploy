import mongoose, { Types } from "mongoose";
import { IChat, IChatAdmin } from "./chats.interface"
import { Chats, ChatsAdmin } from "./chats.model"


const createMessage = async (data: IChat): Promise<any> => {

    const result = await Chats.create(data);
    return result;
    // const populatedMessage = await Chats.aggregate([
    //     {
    //         $match: { _id: result._id }
    //     },
    //     {
    //         $lookup: {
    //             from: "trainers", // Trainer collection
    //             localField: "sender",
    //             foreignField: "_id",
    //             as: "senderTrainerInfo"
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "trainees", // Trainee collection
    //             localField: "sender",
    //             foreignField: "_id",
    //             as: "senderTraineeInfo"
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "trainers",
    //             localField: "receiver",
    //             foreignField: "_id",
    //             as: "receiverTrainerInfo"
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "trainees",
    //             localField: "receiver",
    //             foreignField: "_id",
    //             as: "receiverTraineeInfo"
    //         }
    //     },
    //     {
    //         $addFields: {
    //             senderInfo: {
    //                 $arrayElemAt: [
    //                     { $concatArrays: ["$senderTrainerInfo", "$senderTraineeInfo"] },
    //                     0
    //                 ]
    //             },
    //             receiverInfo: {
    //                 $arrayElemAt: [
    //                     { $concatArrays: ["$receiverTrainerInfo", "$receiverTraineeInfo"] },
    //                     0
    //                 ]
    //             }
    //         }
    //     },
    //     {
    //         $project: {
    //             _id: 1,
    //             message: 1,
    //             createdAt: 1,
    //             updatedAt: 1,
    //             sender: {
    //                 _id: "$senderInfo._id",
    //                 firstName: "$senderInfo.firstName",
    //                 lastName: "$senderInfo.lastName",
    //                 profileImage: "$senderInfo.profileImageUrl",
    //                 role: {
    //                     $cond: {
    //                         if: { $gt: [{ $size: "$senderTrainerInfo" }, 0] },
    //                         then: "Trainer",
    //                         else: "Trainee"
    //                     }
    //                 }
    //             },
    //             receiver: {
    //                 _id: "$receiverInfo._id",
    //                 firstName: "$receiverInfo.firstName",
    //                 lastName: "$receiverInfo.lastName",
    //                 profileImage: "$receiverInfo.profileImageUrl",
    //                 role: {
    //                     $cond: {
    //                         if: { $gt: [{ $size: "$receiverTrainerInfo" }, 0] },
    //                         then: "Trainer",
    //                         else: "Trainee"
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // ]);

    // console.log('final data', populatedMessage);
    // return populatedMessage.length > 0 ? populatedMessage[0] : result;
};


const createAdminMessage = async (data: IChatAdmin): Promise<any> => {

    const result = await ChatsAdmin.create(data)
    return result;
}

const getUserChats = async (data: any): Promise<IChat[]> => {

    const userId = data?.receiver;
    const result = await Chats.find({
        $or: [
            { sender: data?.sender, receiver: userId },
            { sender: userId, receiver: data?.sender }
        ]
    });

    await Chats.updateMany(
        { sender: data?.sender, receiver: userId, readBy: { $ne: userId } },
        { $push: { readBy: userId } }
    );

    return result;
}

const getAdminChats = async (data: any) => {

    const sender = data?.sender;
    const receiver = data?.receiver;
    const result = await ChatsAdmin.find({
        $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender }
        ]
    });

    return result;

};
const getAlUserWithIChats = async (currentUserId: string) => {
    try {
        const result = await Chats.aggregate([
            {
                $match: {
                    $or: [
                        { sender: new mongoose.Types.ObjectId(currentUserId) },
                        { receiver: new mongoose.Types.ObjectId(currentUserId) },
                    ],
                },
            },
            {
                $sort: { createdAt: -1 }, // Sort messages to get the latest first
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", new mongoose.Types.ObjectId(currentUserId)] },
                            then: "$receiver",
                            else: "$sender",
                        },
                    },
                    lastMessage: { $first: "$message" },
                    lastMessageDate: { $first: "$createdAt" },
                    unreadCount: {
                        $sum: {
                            $cond: {
                                if: {
                                    $and: [
                                        { $eq: ["$receiver", new mongoose.Types.ObjectId(currentUserId)] }, // Must be received
                                        { $not: { $in: [new mongoose.Types.ObjectId(currentUserId), "$readBy"] } }, // Not read by user
                                    ],
                                },
                                then: 1,
                                else: 0,
                            },
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "trainers",
                    localField: "_id",
                    foreignField: "_id",
                    as: "trainerDetails",
                },
            },
            {
                $lookup: {
                    from: "trainees",
                    localField: "_id",
                    foreignField: "_id",
                    as: "traineeDetails",
                },
            },
            {
                $addFields: {
                    userDetails: {
                        $arrayElemAt: [
                            { $concatArrays: ["$trainerDetails", "$traineeDetails"] },
                            0,
                        ],
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    traineeTrainerId: "$userDetails._id",
                    userId: "$userDetails.user",
                    firstName: "$userDetails.firstName",
                    lastName: "$userDetails.lastName",
                    contactNo: "$userDetails.contactNo",
                    profileImageUrl: "$userDetails.profileImageUrl",
                    lastMessage: 1,
                    lastMessageDate: 1,
                    unreadCount: 1, // Include unread messages count
                },
            },
            {
                $sort: { lastMessageDate: -1 }, // Sort by most recent conversation
            },
        ]);

        return result;

    } catch (error) {
        console.error("Error fetching chat users:", error);
        throw error;
    }
};


export const messageServices = {
    createMessage,
    createAdminMessage,
    getUserChats,
    getAdminChats,
    getAlUserWithIChats,
}