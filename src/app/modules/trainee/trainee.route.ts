import { Router } from "express";
import auth from "../../middlewares/auth";
import { traineeController } from "./trainee.controller";
import { upload } from "../../helpers/fileUploader";
import { ENUM_USER_ROLE } from "../../enums/user";

const router = Router();

router.get('/', auth(), traineeController.getAllTrainee)
router.get('/analytics', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), traineeController.getTraineesByMonth)
router.get('/dashboard', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), traineeController.getAllForAdminTrainee)
router.patch('/:id',
    upload.single('file'), auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), traineeController.updateTrainee)


export const TraineeRouter = router;