import { Router } from "express";
import { upload } from "../../helpers/fileUploader";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../enums/user";
import { specialismController } from "./specialism.controller";

const router = Router();

router.post('/create/:id',
    upload.single('file'), auth(ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), specialismController.createSpecialism)

router.get('/:id', specialismController.getAllOfUserSpecialism)
router.delete('/:id', auth(ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), specialismController.deleteSpecialism)

export const SpecialismRouter = router;