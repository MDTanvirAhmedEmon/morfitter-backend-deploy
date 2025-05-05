import { Schema, model } from "mongoose";
import { ILikes } from "./likes.interface";

const likesSchema: Schema<ILikes> = new Schema({
    contentId: { type: Schema.Types.ObjectId, ref: "Content"},
    userId: { type: Schema.Types.ObjectId, ref: "User"},

}, { timestamps: true });

export const Likes = model<ILikes>("Likes", likesSchema);
