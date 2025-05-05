import { Types } from "mongoose";

export interface IInvitation {
    trainer_id?: Types.ObjectId;
    trainee_id?: Types.ObjectId;
}
