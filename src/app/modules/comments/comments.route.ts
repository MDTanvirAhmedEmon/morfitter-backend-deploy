import { Router } from "express";
import auth from "../../middlewares/auth";
import { commentsController } from "./comments.controller";

const router = Router();

router.post('/do-comment', auth(), commentsController.doComment)
router.get('/:id', auth(), commentsController.getAllComments)
router.delete('/:id', auth(), commentsController.deleteMyComment)

// router.get('/:id', )

export const CommentsRouter = router;