import { Types } from "mongoose";

export type ITrainee = {
    firstName: string;
    lastName: string;
    gymMember?: string;
    address?: string;
    gender?: 'male' | 'female' | 'others';
    contactNo?: string;
    profileImageUrl?: string;
    title?: string;
    userName: string;
    dob?: Date;
    country?: string;
    city?: string;
    height?: number;
    heightMeasurement?: string;
    weight?: number;
    weightMeasurement?: string;
    fitterGoal?: string;
    interest?: string[];
    towardsGoal?: string;
    achieveGoal?: string;
    TikTok?: string;
    Instagram?: string;
    Facebook?: string;
    Youtube?: string;
    Twitter?: string;
    user?: Types.ObjectId;
}