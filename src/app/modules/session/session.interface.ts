import { Types } from "mongoose";

interface Video {
    _id: any;
    title: string;
    url: string;
    duration: string;
}

export interface ITrainingSession {
    trainer_id?: Types.ObjectId;
    title: string,
    sessionType: "live_group" | "recorded" | "1on1";
    // sessionMode: "group" | ;
    status?: "in-progress" | "blocked";
    fitnessFocus: string;
    description?: string;
    otherFocus?: string;
    recordedContent?: Video[];
    accessType: "free" | "membership" | "followers";
    frequency?: "weekly" | "fortnightly" | "monthly";
    membership_fee?: number;
    promo_image?: string;
    promo_video?: string;
}
