import { Types } from "mongoose";

export interface IPurchaseAccess {
    session_id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    trainer_id?: Types.ObjectId;
    purchaseDate: Date;
    purchase_session_id?: string;
    paymentStatus: "pending" | "paid" | "failed" | "free";
    completedVideos: Types.ObjectId[]; // Track completed videos
    sessionCompleted?: boolean; // True when all videos are watched
    paymentDetails?: {
        transactionId: string;
        amountPaid: number;
    };
    currency: string,
}
