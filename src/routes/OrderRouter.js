import express from 'express';
import OrderController from '../controllers/OrderController.js';
import {
    authMiddleware,
    authUserMiddleware,
} from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/getAllOrder', OrderController.getAllOrder);
router.post('/createOrder', OrderController.createOrder);
router.get('/getAllOrderDetail/:id', OrderController.getAllOrderDetail);
router.get('/getOrderDetail/:id', OrderController.getOrderDetail);
router.delete('/cancelOrderDetail/:id', OrderController.cancelOrderDetail);
router.get('/getDeletedOrder', OrderController.getDeletedOrders);
router.delete('/deleteCanceledOrder/:id', OrderController.deleteCanceledOrder);

export default router;
