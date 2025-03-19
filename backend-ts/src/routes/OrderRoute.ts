import express from "express";
import { jwtCheck, jwtParse } from "../../middleware/auth";
import OrderController from "../Controllers/OrderController";

const router = express.Router();

router.get("/", jwtCheck, jwtParse as any, OrderController.getMyOrders);

router.post("/checkout/create-checkout-session", jwtCheck, jwtParse as any, OrderController.createCheckoutSession);

router.post("/checkout/webhook", OrderController.stripeWebhookHandler);
export default router;
