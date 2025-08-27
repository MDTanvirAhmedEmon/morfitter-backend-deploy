import { Router } from "express";
import { paymentController } from "./payment.controller";
const router = Router();

router.get('/onboarding-complete', paymentController.OnboardingComplete)
router.post('/generate-oauth', paymentController.generateOAuthLink)
router.post('/payout', paymentController.createPayout)

export const PaymentRouter = router;