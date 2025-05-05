import { Types } from "mongoose";

export interface IFollower {
    follower_id?: Types.ObjectId;
    following_id?: Types.ObjectId;
}
