import { Schema, model, Types } from "mongoose";
import { ISessionReview } from "./sessinReview.interface";

const sessionReviewSchema: Schema<ISessionReview> = new Schema({
    session_id: { type: Types.ObjectId, ref: "Session" },
    user_id: { type: Types.ObjectId, ref: "User" },
    review_text: { type: String, required: true },
    rating: { type: Number, required: true },

}, { timestamps: true });

export const SessionReview = model<ISessionReview>("SessionReview", sessionReviewSchema);
