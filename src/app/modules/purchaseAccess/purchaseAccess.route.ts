import { Router } from "express";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../enums/user";
import { purchaseAccessController } from "./purchaseAccess.controller";


const router = Router();

router.get('/my-enrolled-session', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), purchaseAccessController.myEnrolledSesion)
router.get('/get-all-payments', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), purchaseAccessController.getAllPayments)
router.get('/total-enrollment/:id', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), purchaseAccessController.getTotalEnrollment)
router.get('/total-members/:id', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), purchaseAccessController.getTotalEnrollmentForTrainer)
router.get('/total-membership/', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), purchaseAccessController.myMemberships)
router.post('/check-existence', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), purchaseAccessController.checkEnrollment)
router.post('/enroll', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), purchaseAccessController.enrollNow)
router.patch('/mark-video', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), purchaseAccessController.markVideoAsComplete)


export const PurchaseAccessRouter = router;