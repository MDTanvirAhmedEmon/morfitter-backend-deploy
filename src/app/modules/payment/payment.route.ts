import express from 'express';
import { Router } from "express";
import { paymentController } from "./payment.controller";
const router = Router();

router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.webhookService)
// router.patch('/make-payment', paymentController.makePayment)
router.post('/generate-oauth', paymentController.generateOAuthLink)
router.post('/payout', paymentController.createPayout)

// router.get('/:id', )

export const PaymentRouter = router;