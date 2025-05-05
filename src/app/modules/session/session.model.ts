import { Schema, model, Types } from "mongoose";
import { ITrainingSession } from "./session.interface";

const videoSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    duration: { type: String, required: true },
});


const trainingSessionSchema: Schema<ITrainingSession> = new Schema({
    trainer_id: { type: Types.ObjectId, ref: "Trainer"},
    title: { type: String, required: true},
    sessionType: { type: String, enum: ["live_group" , "recorded" , "1on1"], required: true },
    // sessionMode: { type: String, enum: ["group", "1on1"], required: true },
    status: { type: String, enum: ["in-progress", "blocked"], default: "in-progress" },
    fitnessFocus: { type: String, required: true },
    description: { type: String },
    otherFocus: { type: String },
    recordedContent: { type: [videoSchema] }, 
    accessType: { type: String, enum: ["free", "membership", "followers"], required: true },
    frequency: { type: String, enum: ["weekly", "fortnightly", "monthly"] },
    membership_fee: { type: Number },
    promo_image: { type: String },
    promo_video: { type: String },
}, { timestamps: true }); 

// Create the TrainingSession model
export const TrainingSession = model<ITrainingSession>("TrainingSession", trainingSessionSchema);
