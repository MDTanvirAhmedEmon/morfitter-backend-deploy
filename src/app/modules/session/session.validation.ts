import { z } from "zod";
import { Types } from "mongoose";

const VideoSchema = z.object({
    title: z.string({
        required_error: "Video title is required",
        invalid_type_error: "Video title must be a string",
    }).min(1, "Video title cannot be empty"),
    url: z.string({
        required_error: "Video URL is required",
        invalid_type_error: "Video URL must be a string",
    }).url("Video URL must be a valid URL"),
    duration: z.string({
        required_error: "Video duration is required",
        invalid_type_error: "Video duration must be a string",
    }),
});

export const trainingSessionValidatedSchema = z.object({
    trainer_id: z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: "Invalid trainer ID",
    }).optional(),

    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string",
    }),

    sessionType: z.enum(["live_group", "recorded", "1on1"], {
        required_error: "Session type is required",
        invalid_type_error: "Session type must be 'live' or 'recorded'",
    }),

    // sessionMode: z.enum(["group", "1on1"], {
    //     required_error: "Session mode is required",
    //     invalid_type_error: "Session mode must be 'group' or '1on1'",
    // }),
    status: z.enum(["in-progress", "blocked"], {
        required_error: "Status is required",
        invalid_type_error: "Status must be 'in-progress' or 'blocked'",
    }).optional(),

    fitnessFocus: z.string({
        required_error: "Fitness focus is required",
        invalid_type_error: "Fitness focus must be a string",
    }),

    description: z.string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string",
    }).optional(),

    otherFocus: z.string({
        required_error: "Other focus is required",
        invalid_type_error: "Other focus must be a string",
    }).optional(),

    recordedContent: z.array(VideoSchema).optional(),

    accessType: z.enum(["free", "membership", "followers"], {
        required_error: "Access type is required",
        invalid_type_error: "Access type must be 'free', 'membership', or 'followers'",
    }),

    frequency: z.enum(["weekly", "fortnightly", "monthly"], {
        required_error: "Frequency is required",
        invalid_type_error: "Frequency must be 'weekly' or 'monthly'",
    }).optional(),

    membership_fee: z.number({
        required_error: "Membership fee is required",
        invalid_type_error: "Membership fee must be a number",
    }).optional(),

    promo_image: z.string().url("Promo image must be a valid URL").optional(),

    promo_video: z.string().url("Promo video must be a valid URL").optional(),

    zoomLink: z.string().url("Zoom Link must be a valid URL").optional(),
    meetingId: z.string().url("Meeting Id must be a valid Id").optional(),
    passcode: z.string().url("Passcode must be a valid Code").optional(),
    startTime: z.string().url("StartTime must be a valid time").optional(),
    druration: z.string().url("Druration must be a valid string").optional(),
});
