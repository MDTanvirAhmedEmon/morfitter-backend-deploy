import { Types } from "mongoose";

export interface IComments {
    text: string;
    content_id: Types.ObjectId;
    user_id: Types.ObjectId;
}
