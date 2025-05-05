import { Schema, model, Types } from "mongoose";
import { IInvitation } from "./invitation.interface";

const specialismSchema: Schema<IInvitation> = new Schema({
    trainer_id: { type: Types.ObjectId, ref: "Trainer"},
    trainee_id: { type: Types.ObjectId, ref: "Trainee"},

}, { timestamps: true });

export const Invitation = model<IInvitation>("Invitation", specialismSchema);
