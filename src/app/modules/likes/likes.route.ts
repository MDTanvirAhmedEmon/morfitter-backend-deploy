import { Router } from "express";
import auth from "../../middlewares/auth";
import { likesController } from "./likes.controller";

const router = Router();

router.patch('/like-dislike', auth(), likesController.likeDisLike)

// router.get('/:id', )

export const LikesRouter = router;