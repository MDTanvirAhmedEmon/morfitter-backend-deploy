import { Schema, model, Types } from "mongoose";
import { ISpecialism } from "./specialism.interface";

const specialismSchema: Schema<ISpecialism> = new Schema({
    specialism: { type: String, required: true},
    trainer_id: { type: Types.ObjectId, ref: "Trainer"},

}, { timestamps: true });

export const Specialism = model<ISpecialism>("Specialism", specialismSchema);
