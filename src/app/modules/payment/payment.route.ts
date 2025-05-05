import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router();

router.patch('/make-payment', paymentController.makePayment)
router.patch('/execute-payment', paymentController.executePayment)

// router.get('/:id', )

export const PaymentRouter = router;