import mongoose, { Schema, model } from "mongoose";
import { IContent } from "./content.interface";

const contentSchema: Schema<IContent> = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    specialism: { type: String, required: true },
    status: { type: String, enum: ["in-progress", "blocked"], required: true },
    videoUrl: { type: String, required: false },
    imageUrl: { type: String, required: false },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export const Content = model<IContent>("Content", contentSchema);
