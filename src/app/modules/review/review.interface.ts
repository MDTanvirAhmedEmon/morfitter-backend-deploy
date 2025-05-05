import { Types } from "mongoose";

export interface IReview {
    trainer_id?: Types.ObjectId;
    trainee_id?: Types.ObjectId;
    review_text: String;
    rating: Number;
}
