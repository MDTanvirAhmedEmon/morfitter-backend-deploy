import { Types } from "mongoose";

export interface ISessionReview {
    session_id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    review_text: String;
    rating: Number;
}
