import { Types } from "mongoose";

export interface IContent {
    title: string;
    content: string;
    specialism: string;
    status: "in-progress" | "blocked";
    videoUrl?: string;
    imageUrl?: string;
    userId?: Types.ObjectId;
}
