import { Router } from "express";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../enums/user";
import { sessionReviewController } from "./sessinReview.controller";

const router = Router();

router.get('/:id', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), sessionReviewController.getAllReviewOfSession)
router.post('/give-review', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), sessionReviewController.giveReview)
// router.get('/get-review/:id', auth(ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.TRAINEE), reviewController.getReviewOfTrainer)


// router.get('/:id', )

export const SessionReviewRouter = router;