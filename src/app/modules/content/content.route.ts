import { Router } from "express";
import { contentController } from "./content.controller";
import auth from "../../middlewares/auth";
import { upload } from "../../helpers/fileUploader";
import { ENUM_USER_ROLE } from "../../enums/user";

const router = Router();

router.post('/create', auth(), upload.single('file'), contentController.createContent)
router.get('/for-loggout-users', contentController.getAllContentForLogOutUsers)
router.get('/', auth(), contentController.getAllContent)
router.get('/admin', auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN), contentController.getAllForAdminContent)
router.get('/my-content', auth(), contentController.getMyContent)
router.get('/:id', auth(), contentController.getSingleContent)
router.patch('/:id', auth(), upload.single('file'), contentController.updateContent)
router.patch('/block-unblock/:id', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), contentController.blockUnblock)
router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER), contentController.deleteContent)


export const ContentRouter = router;