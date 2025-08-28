import { Router } from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../enums/user";
const router = Router();

router.get('/onboarding-complete', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), paymentController.OnboardingComplete)
router.get('/check-stripe-connected-or-not', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), paymentController.checkStripeConnectedOrNot)
router.post('/generate-oauth', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), paymentController.generateOAuthLink)
// router.post('/payout', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), paymentController.createPayout)

export const PaymentRouter = router;