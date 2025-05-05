import { Router } from "express";
import { adminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidation } from "./admin.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../enums/user";
import { upload } from "../../helpers/fileUploader";

const router = Router();

router.post('/create', validateRequest(adminValidation.adminValidationSchema), adminController.createAdmin)
router.get('/get-admin-info', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), adminController.getAdmin)
router.patch('/update', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), upload.single('file'), adminController.updateAdmin)

export const AdminRouter = router