import { Schema, model, Types } from "mongoose";
import { IReview } from "./review.interface";

const specialismSchema: Schema<IReview> = new Schema({
    trainer_id: { type: Types.ObjectId, ref: "Trainer"},
    trainee_id: { type: Types.ObjectId, ref: "Trainee"},
    review_text: { type: String, required: true},
    rating: { type: Number, required: true},

}, { timestamps: true });

export const Review = model<IReview>("Review", specialismSchema);
