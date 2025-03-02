import express from 'express';
import BorrowController from '../controllers/BorrowController.js';
import {
    authMiddleware,
    authUserMiddleware,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/getAllBorrows', BorrowController.getAllBorrows);
router.post('/createBorrow', authUserMiddleware, BorrowController.createBorrow);
router.get(
    '/getBorrowDetail/:id',
    authUserMiddleware,
    BorrowController.getBorrowDetail,
);
router.get(
    '/getAllBorrowDetail/:id',
    authUserMiddleware,
    BorrowController.getAllBorrowDetail,
);

router.delete(
    '/returnBorrow/:id',
    authUserMiddleware,
    BorrowController.returnBorrow,
);

router.get('/getDeletedBorrows', BorrowController.getDeletedBorrows);
router.delete(
    '/deleteCanceledBorrow/:id',
    BorrowController.deleteCanceledBorrow,
);

export default router;
