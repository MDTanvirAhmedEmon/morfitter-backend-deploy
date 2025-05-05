import { ILikes } from "./likes.interface";
import { Likes } from "./likes.model";

const likeDisLike = async (data: Partial<ILikes>): Promise<{ message: string }> => {

    const isLiked = await Likes.findOne(data);

    if (isLiked) {
        await Likes.deleteOne(data);
        return { message: "Disliked successfully" };
    }

    await Likes.create(data);
    return { message: "Liked successfully" };

};

export const likesServices = {
    likeDisLike,
};
