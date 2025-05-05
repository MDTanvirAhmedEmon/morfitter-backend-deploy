import mongoose, { Schema, model } from 'mongoose';
import { ITrainer } from './trainer.interface';

const trainerSchema = new Schema<ITrainer>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'others'],
    },
    contactNo: {
      type: String,
    },
    profileImageUrl: {
      type: String,
    },
    dob: {
      type: Date,
    },
    userName: {
      type: String,
      required: true
    },
    country: {
      type: String,
    },
    zipCode: {
      type: Number,
    },
    earning: {
      type: Number,
    },
    about: {
      type: String,
    },
    onlineSession: {
      type: String,
      enum: ['yes', 'no'],
    },
    faceToFace: {
      type: String,
      enum: ['yes', 'no'],
    },
    consultationType: {
      type: String,
      enum: ['paid', 'free', 'both'],
    },
    qualification: {
      type: [String],
    },
    specialism: {
      type: [String],
    },
    radius: {
      type: String,
    },
    TikTok: { type: String },
    Instagram: { type: String },
    Facebook: { type: String },
    Youtube: { type: String },
    Twitter: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Trainer = model<ITrainer>('Trainer', trainerSchema);
