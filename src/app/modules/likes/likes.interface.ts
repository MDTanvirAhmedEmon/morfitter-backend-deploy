import { Types } from "mongoose";

export interface ILikes {
    contentId: Types.ObjectId;
    userId: Types.ObjectId;
}
