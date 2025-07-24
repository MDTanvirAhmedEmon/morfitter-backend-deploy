import { Router } from "express";
import { paymentController } from "./payment.controller";
import express from 'express';
const router = Router();

router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.webhookService)


export const WebHookRouter = router;