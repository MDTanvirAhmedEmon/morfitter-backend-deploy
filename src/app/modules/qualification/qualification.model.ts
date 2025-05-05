import { Schema, model, Types } from "mongoose";
import { IQualification } from "./qualification.interface";

const qualificationSchema: Schema<IQualification> = new Schema({
    qualification: { type: String, required: true},
    trainer_id: { type: Types.ObjectId, ref: "Trainer"},

}, { timestamps: true });

export const Qualification = model<IQualification>("Qualification", qualificationSchema);
