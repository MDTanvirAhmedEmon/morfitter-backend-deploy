import { z } from "zod";
import { Types } from "mongoose";

export const contentValidatedSchema = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string",
    }).min(1, "Title cannot be empty"),

    content: z.string({
        required_error: "Content is required",
        invalid_type_error: "Content must be a string",
    }).min(1, "Content cannot be empty"),

    specialism: z.string(z.string({
        required_error: "Specialism is required",
        invalid_type_error: "Specialism must be a string",
    })).min(1,"Specialism cannot be empty"),

    status: z.enum(["in-progress", "blocked"], {
        required_error: "Status is required",
        invalid_type_error: "Status must be 'in-progress' or 'blocked'",
    }),

    videoUrl: z.string().url("Video URL must be a valid URL").optional(),

    imageUrl: z.string().url("Image URL must be a valid URL").optional(),

    userId: z.custom<Types.ObjectId>((val) => Types.ObjectId.isValid(val), {
        message: "Invalid user ID",
    }).optional(),
});
