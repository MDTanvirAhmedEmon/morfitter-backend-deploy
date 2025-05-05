import { Router } from "express";
import { upload } from "../../helpers/fileUploader";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../enums/user";
import { qualificationController } from "./qualification.controller";


const router = Router();

router.post('/create/:id',
    upload.single('file'), auth(ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), qualificationController.createQualification)

router.get('/:id', qualificationController.getAllOfUserQualification)
router.delete('/:id', auth(ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN), qualificationController.deleteQualification)

export const QualificationRouter = router;