import express from "express";
import OrderController from "../controllers/OrderController.js";
import {
  authMiddleware,
  authUserMiddleware,
} from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/getAllOrder", OrderController.getAllOrder);
router.post("/createOrder", authUserMiddleware, OrderController.createOrder);
router.get(
  "/getAllOrderDetail/:id",
  authUserMiddleware,
  OrderController.getAllOrderDetail
);
router.get(
  "/getOrderDetail/:id",
  authUserMiddleware,
  OrderController.getOrderDetail
);
router.delete(
  "/cancelOrderDetail/:id",
  authUserMiddleware,
  OrderController.cancelOrderDetail
);

export default router;
