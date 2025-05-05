import { Types } from "mongoose";

export interface ISpecialism {
    specialism: string
    trainer_id?: Types.ObjectId;
}
