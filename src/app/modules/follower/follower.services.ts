import mongoose from "mongoose";
import { IFollower } from "./follower.interface"
import { Follower } from "./follower.model";


const followAndUnfollow = async (data: IFollower) => {
    if (data?.follower_id === data?.following_id) {
        throw new Error("You cannot follow yourself.");
    }

    const existingFollow = await Follower.findOne({
        follower_id: data?.follower_id,
        following_id: data?.following_id,
    });

    if (existingFollow) {
        // If already following, unfollow (delete record)
        await Follower.deleteOne({
            follower_id: data?.follower_id,
            following_id: data?.following_id,
        });
        return { message: "Unfollowed successfully!" };
    } else {
        // If not following, follow (insert new record)
        await Follower.create({
            follower_id: data?.follower_id,
            following_id: data?.following_id,
        });

        return { message: "Followed successfully!" };
    }
}

const getMyfollower = async (id: any) => {
    const objectId = new mongoose.Types.ObjectId(id);

    const followers = await Follower.aggregate([
        { $match: { following_id: objectId } },
        // {
        //     $lookup: {
        //         from: "users", 
        //         localField: "follower_id",
        //         foreignField: "_id",
        //         as: "userData"
        //     }
        // },
        // { $unwind: "$userData" }, 
        // {
        //     $lookup: {
        //         from: "trainers",
        //         localField: "userData._id",
        //         foreignField: "user",
        //         as: "trainerData"
        //     }
        // },
        // {
        //     $lookup: {
        //         from: "trainees",
        //         localField: "userData._id",
        //         foreignField: "user",
        //         as: "traineeData"
        //     }
        // },
        // {
        //     $addFields: {
        //         followerDetails: {
        //             $cond: {
        //                 if: { $gt: [{ $size: "$trainerData" }, 0] },
        //                 then: {
        //                     $mergeObjects: [
        //                         { role: "trainer" },
        //                         { $arrayElemAt: ["$trainerData", 0] }
        //                     ]
        //                 },
        //                 else: {
        //                     $mergeObjects: [
        //                         { role: "trainee" },
        //                         { $arrayElemAt: ["$traineeData", 0] }
        //                     ]
        //                 }
        //             }
        //         }
        //     }
        // },
        // {
        //     $project: {
        //         trainerData: 0,
        //         traineeData: 0,
        //         userData: 0,
        //         __v: 0
        //     }
        // },
        // {
        //     $project: {
        //         _id: 1,
        //         follower_id: 1,
        //         following_id: 1,
        //         createdAt: 1,
        //         updatedAt: 1,
        //         "followerDetails.firstName": 1,
        //         "followerDetails.lastName": 1,
        //         "followerDetails.profileImageUrl": 1,
        //         "followerDetails.gender": 1,
        //         "followerDetails.userName": 1,
        //         "followerDetails.role": 1
        //     }
        // }
        { $count: "totalFollower" }
    ]);

    return followers.length > 0 ? followers[0] : { totalFollower: 0 };;

}

const getIAmFollowing = async (id: any) => {
    const objectId = new mongoose.Types.ObjectId(id);

    const following = await Follower.aggregate([
        { $match: { follower_id: objectId } },
        {
            $lookup: {
                from: "users",
                localField: "following_id",
                foreignField: "_id",
                as: "userData"
            }
        },
        { $unwind: "$userData" },
        {
            $lookup: {
                from: "trainers",
                localField: "userData._id",
                foreignField: "user",
                as: "trainerData"
            }
        },
        {
            $lookup: {
                from: "trainees",
                localField: "userData._id",
                foreignField: "user",
                as: "traineeData"
            }
        },
        {
            $addFields: {
                followingDetails: {
                    $cond: {
                        if: { $gt: [{ $size: "$trainerData" }, 0] },
                        then: {
                            $mergeObjects: [
                                { role: "trainer" },
                                { $arrayElemAt: ["$trainerData", 0] }
                            ]
                        },
                        else: {
                            $mergeObjects: [
                                { role: "trainee" },
                                { $arrayElemAt: ["$traineeData", 0] }
                            ]
                        }
                    }
                }
            }
        },
        {
            $project: {
                trainerData: 0,
                traineeData: 0,
                userData: 0,
                __v: 0
            }
        },
        {
            $project: {
                _id: 1,
                follower_id: 1,
                following_id: 1,
                createdAt: 1,
                updatedAt: 1,
                "followingDetails.firstName": 1,
                "followingDetails.lastName": 1,
                "followingDetails.profileImageUrl": 1,
                "followingDetails.gender": 1,
                "followingDetails.userName": 1,
                "followingDetails.role": 1
            }
        },
        { $limit: 6 },
        { $sort: { createdAt: -1 } }
    ]);

    return following;
};


export const followAndUnfollowServices = {
    followAndUnfollow,
    getMyfollower,
    getIAmFollowing,
}