import { Router } from "express";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../enums/user";
import { followAndUnfollowController } from "./follower.controller";

const router = Router();

router.post('/', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), followAndUnfollowController.followAndUnfollow)
router.get('/:id', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), followAndUnfollowController.getMyfollower)
router.get('/following/:id', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), followAndUnfollowController.getIAmFollowing)

export const followAndUnfollowRouter = router;