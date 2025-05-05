import { Types } from "mongoose";

export interface IQualification {
    qualification: string
    trainer_id?: Types.ObjectId;
}
