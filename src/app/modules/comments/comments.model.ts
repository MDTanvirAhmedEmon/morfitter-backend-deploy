import { Schema, model } from "mongoose";
import { IComments } from "./comments.interface";

const commentSchema = new Schema<IComments>(
    {
        text: { type: String, required: true },
        content_id: { type: Schema.Types.ObjectId, ref: "Content", required: true },
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const Comments = model<IComments>("Comment", commentSchema);
