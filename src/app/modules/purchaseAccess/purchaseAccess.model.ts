import { Schema, model, Types } from "mongoose";
import { IPurchaseAccess } from "./purchaseAccess.interface";

const purchaseAccessSchema: Schema<IPurchaseAccess> = new Schema({
    session_id: { type: Types.ObjectId, ref: "TrainingSession" },
    trainer_id: { type: Types.ObjectId, ref: "Trainer" },
    user_id: { type: Types.ObjectId, ref: "User" },
    purchaseDate: { type: Date, default: Date.now, required: true },
    purchase_session_id: { type: String },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "free"],
        required: true,
        default: "pending",
    },
    completedVideos: [{ type: Types.ObjectId }], // Store completed video IDs
    sessionCompleted: { type: Boolean, default: false }, // Only true when all session videos are watched
    paymentDetails: {
        transactionId: { type: String, required: false },
        amountPaid: { type: Number, required: false },
    },
    currency: { type: String },
}, { timestamps: true });

export const PurchaseAccess = model<IPurchaseAccess>("PurchaseAccess", purchaseAccessSchema);
