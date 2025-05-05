import { model, Schema } from "mongoose";
import { ITrainee } from "./trainee.interface";

const traineeSchema: Schema<ITrainee> = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gymMember: { type: String },
    address: {
        type: String,
    },
    gender: { type: String, enum: ['male', 'female', 'others'] },
    contactNo: { type: String },
    profileImageUrl: { type: String },
    title: { type: String },
    userName: { type: String, required: true, unique: true },
    dob: { type: Date },  // Use `Date` type if possible
    country: { type: String },
    city: { type: String },
    height: { type: Number },
    heightMeasurement: { type: String },
    weight: { type: Number },
    weightMeasurement: { type: String },
    fitterGoal: { type: String },  // Enum can be added if predefined values are known
    interest: { type: [String] },
    towardsGoal: { type: String },
    achieveGoal: { type: String },
    TikTok: { type: String },
    Instagram: { type: String },
    Facebook: { type: String },
    Youtube: { type: String },
    Twitter: { type: String },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'User id is required'],
        unique: true,
        ref: 'User',
    }
}, {
    timestamps: true
});

export const Trainee = model<ITrainee>('Trainee', traineeSchema);