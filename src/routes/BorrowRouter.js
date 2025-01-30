import express from 'express';
import BorrowController from '../controllers/BorrowController.js';
import {
    authMiddleware,
    authUserMiddleware,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/getAllBorrows', BorrowController.getAllBorrows);
router.post('/createBorrow', BorrowController.createBorrow);
router.get('/getBorrowDetail/:id', BorrowController.getBorrowDetail);
router.get('/getAllBorrowDetail/:id', BorrowController.getAllBorrowDetail);
router.delete('/returnBorrow/:id', BorrowController.returnBorrow);
router.put(
    '/returnBorrowItem/:borrowId/:itemId',
    BorrowController.returnBorrowItem,
); // Endpoint mới
router.get('/getDeletedBorrows', BorrowController.getDeletedBorrows);
router.delete(
    '/deleteCanceledBorrow/:id',
    BorrowController.deleteCanceledBorrow,
);

export default router;
