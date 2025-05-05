import { Schema, model, Types } from "mongoose";
import { IFollower } from "./follower.interface";

const followerSchema: Schema<IFollower> = new Schema({
    follower_id: { type: Types.ObjectId },
    following_id: { type: Types.ObjectId },
}, { timestamps: true });

export const Follower = model<IFollower>("Follower", followerSchema);
