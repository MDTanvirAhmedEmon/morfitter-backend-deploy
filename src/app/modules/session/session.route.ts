import { Router } from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../helpers/fileUploader";
import { sessionController } from "./session.controller";
import { ENUM_USER_ROLE } from "../../enums/user";

const router = Router();

router.post('/create', auth(),
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
    ]), sessionController.createSession)
router.get('/', auth(), sessionController.getAllSession)
router.get('/admin', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), sessionController.getAllSessionForAdmin)
router.get('/:id', auth(), sessionController.getMySession)
router.get('/single/:id', auth(), sessionController.getSingleSession)
router.get('/admin/single/:id', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), sessionController.getSingleForAdminSession)
router.patch('/update/:id', auth(ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
    ]), sessionController.updateSessionDetails)
router.patch('/:id', auth(), upload.single('file'), sessionController.updateSession)
router.patch('/block-unblock/:id', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), upload.single('file'), sessionController.blockUnblock)
router.delete('/delete-video', auth(), sessionController.deleteSessionContent)
router.delete('/:id', auth(), sessionController.deleteWholeSession)

export const SessionRouter = router;