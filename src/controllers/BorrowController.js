import BorrowService from '../services/BorrowService.js';

const getAllBorrows = async (req, res) => {
    try {
        const data = await BorrowService.getAllBorrows();
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

// const createBorrow = async (req, res) => {
//     try {
//         const {
//             userId,
//             borrowItems,
//             borrowAddress,
//             borrowDate,
//             borrowDuration, // Thêm borrowDuration
//             totalPrice,
//         } = req.body;

//         // Kiểm tra dữ liệu đầu vào
//         if (
//             !userId ||
//             !borrowItems ||
//             borrowItems.length === 0 ||
//             !borrowAddress ||
//             !borrowAddress.fullName ||
//             !borrowAddress.phone ||
//             !borrowAddress.address ||
//             !borrowDate ||
//             !borrowDuration ||
//             !totalPrice
//         ) {
//             return res.status(400).json({
//                 status: 'ERR',
//                 message:
//                     'All input fields, including borrow address, are required.',
//             });
//         }

//         // Tạo dữ liệu cho bản ghi mượn
//         const newBorrowData = {
//             user: userId,
//             borrowItems,
//             borrowAddress,
//             borrowDate,
//             borrowDuration,
//             totalPrice,
//         };

//         // Gọi BorrowService để xử lý logic tạo đơn mượn
//         const response = await BorrowService.createBorrow(newBorrowData);
//         return res.status(201).json(response);
//     } catch (error) {
//         console.error('Error in createBorrow:', error);
//         return res.status(500).json({
//             status: 'ERR',
//             message: 'Internal Server Error.',
//         });
//     }
// };

const createBorrow = async (req, res) => {
    try {
        const { userId, borrowItems, borrowAddress, totalPrice } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (
            !userId ||
            !borrowItems ||
            borrowItems.length === 0 ||
            !borrowAddress ||
            !borrowAddress.fullName ||
            !borrowAddress.phone ||
            !borrowAddress.address ||
            !totalPrice
        ) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All input fields are required.',
            });
        }

        // Tạo dữ liệu cho bản ghi mượn
        const newBorrowData = {
            user: userId,
            borrowItems,
            borrowAddress,
            totalPrice,
        };

        // Gọi BorrowService để xử lý logic tạo đơn mượn
        const response = await BorrowService.createBorrow(newBorrowData);
        return res.status(201).json(response);
    } catch (error) {
        console.error('Error in createBorrow:', error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

const getAllBorrowDetail = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required',
            });
        }
        const response = await BorrowService.getAllBorrowDetail(userId);
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

const getBorrowDetail = async (req, res) => {
    try {
        const borrowId = req.params.id;
        if (!borrowId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The borrowId is required',
            });
        }
        const response = await BorrowService.getBorrowDetail(borrowId);
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

const returnBorrow = async (req, res) => {
    try {
        const borrowId = req.params.id;
        if (!borrowId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The borrowId is required',
            });
        }
        const response = await BorrowService.returnBorrow(borrowId);
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

const returnBorrowItem = async (req, res) => {
    try {
        const { borrowId, itemId } = req.params;
        if (!borrowId || !itemId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Both borrowId and itemId are required',
            });
        }
        const response = await BorrowService.returnBorrowItem(borrowId, itemId);
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

const getDeletedBorrows = async (req, res) => {
    try {
        const data = await BorrowService.getDeletedBorrows();
        return res.status(201).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

const deleteCanceledBorrow = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await BorrowService.deleteCanceledBorrow(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

export default {
    getAllBorrows,
    createBorrow,
    getBorrowDetail,
    getAllBorrowDetail,
    returnBorrow,
    returnBorrowItem,
    getDeletedBorrows,
    deleteCanceledBorrow,
};
