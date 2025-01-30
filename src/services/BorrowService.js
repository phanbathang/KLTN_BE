import Borrow from '../models/BorrowModel.js';
import Product from '../models/ProductModel.js';
import DeletedBorrow from '../models/DeletedBorrow.js';
import { sendEmailCreateBorrow } from '../services/EmailService.js';
import RuleService from './RuleService.js';

const getAllBorrows = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allBorrow = await Borrow.find().sort({ createdAt: -1 });
            const today = new Date();
            for (let borrow of allBorrow) {
                let hasChanges = false;
                for (let item of borrow.borrowItems) {
                    if (!item.isOverdue && item.returnDate < today) {
                        item.isOverdue = true;
                        hasChanges = true;
                    }
                }
                if (hasChanges) {
                    await borrow.save();
                }
            }
            resolve({
                status: 'OK',
                message: 'Successful',
                data: allBorrow,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const createBorrow = async (newBorrow) => {
    try {
        const { user, borrowItems, borrowAddress, totalPrice, email } =
            newBorrow;

        // Kiểm tra dữ liệu đầu vào
        if (
            !user ||
            !borrowItems ||
            borrowItems.length === 0 ||
            !borrowAddress ||
            !borrowAddress.fullName ||
            !borrowAddress.phone ||
            !borrowAddress.address ||
            !totalPrice
        ) {
            return { status: 'ERR', message: 'All input fields are required.' };
        }

        // Kiểm tra từng sản phẩm
        for (let item of borrowItems) {
            if (
                !item.name ||
                !item.amount ||
                !item.image ||
                !item.price ||
                !item.product ||
                !item.borrowDate ||
                !item.borrowDuration
            ) {
                return {
                    status: 'ERR',
                    message:
                        'Each borrow item must have name, amount, image, price, product ID, borrowDate, and borrowDuration.',
                };
            }

            const parsedBorrowDate = new Date(item.borrowDate);
            if (isNaN(parsedBorrowDate.getTime())) {
                return {
                    status: 'ERR',
                    message:
                        'Invalid borrow date format for item: ' + item.name,
                };
            }

            if (
                !item.borrowDuration ||
                item.borrowDuration < 1 ||
                item.borrowDuration > 30
            ) {
                return {
                    status: 'ERR',
                    message:
                        'Borrow duration must be between 1 and 30 days for item: ' +
                        item.name,
                };
            }

            // Tính returnDate và khởi tạo trạng thái
            const returnDate = new Date(parsedBorrowDate);
            returnDate.setDate(
                parsedBorrowDate.getDate() + item.borrowDuration,
            );
            item.returnDate = returnDate;
            item.isReturned = false;
            item.returnedAt = null;
            item.isOverdue = false;

            // Cập nhật tồn kho
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: item.product, countInStock: { $gte: item.amount } },
                { $inc: { countInStock: -item.amount } },
                { new: true },
            );

            if (!updatedProduct) {
                return {
                    status: 'ERR',
                    message: `Product ${item.name} is not available for borrowing.`,
                };
            }
        }

        // Tạo bản ghi mượn
        const createdBorrow = await Borrow.create({
            user,
            borrowItems,
            borrowAddress,
            totalPrice,
        });

        await sendEmailCreateBorrow(email, borrowItems);
        return {
            status: 'OK',
            message: 'Borrow record created successfully.',
            data: createdBorrow,
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: 'Internal server error.',
            error: error.message,
        };
    }
};

const getAllBorrowDetail = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const borrows = await Borrow.find({ user: id })
                .populate('borrowItems.product', 'name price')
                .populate('user', 'name email');

            if (borrows === null) {
                return resolve({
                    status: 'OK',
                    message: 'The borrows is not defined',
                });
            }

            resolve({
                status: 'OK',
                message: 'Get borrow details successfully.',
                data: borrows,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getBorrowDetail = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const borrow = await Borrow.findById(id)
                .populate('borrowItems.product', 'name price')
                .populate('user', 'name email');

            if (!borrow) {
                return resolve({
                    status: 'ERR',
                    message: 'The borrow record is not found.',
                });
            }

            const today = new Date();
            let hasChanges = false;
            for (let item of borrow.borrowItems) {
                if (!item.isOverdue && item.returnDate < today) {
                    item.isOverdue = true;
                    hasChanges = true;
                }
            }
            if (hasChanges) {
                await borrow.save();
            }

            resolve({
                status: 'OK',
                message: 'Borrow record found.',
                data: borrow,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const returnBorrow = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const borrow = await Borrow.findById(id);
            if (!borrow) {
                return resolve({
                    status: 'ERR',
                    message: 'The borrow record is not found.',
                });
            }

            // Lấy phí phạt trễ hạn từ RuleService
            const penaltyResponse = await RuleService.getLatePenaltyFee();
            if (penaltyResponse.status !== 'OK') {
                return resolve({
                    status: 'ERR',
                    message: 'Không thể lấy phí phạt trễ hạn',
                });
            }
            const latePenaltyFee = penaltyResponse.data; // Giá trị phí phạt/ngày

            let penaltyFee = 0;
            const today = new Date();
            for (let item of borrow.borrowItems) {
                if (!item.isReturned) {
                    item.isReturned = true;
                    item.returnedAt = true;
                    if (today > item.returnDate) {
                        const overdueDays = Math.ceil(
                            (today - item.returnDate) / (1000 * 60 * 60 * 24),
                        );
                        penaltyFee += overdueDays * latePenaltyFee; // Sử dụng latePenaltyFee
                        item.isOverdue = true;
                    }
                }
            }

            const revenue = borrow.totalPrice + penaltyFee;

            const promises = borrow.borrowItems.map(async (item) => {
                return Product.findOneAndUpdate(
                    { _id: item.product },
                    { $inc: { countInStock: item.amount } },
                    { new: true },
                );
            });

            await Promise.all(promises);

            await DeletedBorrow.create({
                borrowItems: borrow.borrowItems,
                user: borrow.user,
                borrowAddress: borrow.borrowAddress,
                totalPrice: borrow.totalPrice,
                penaltyFee,
                revenue,
            });

            await Borrow.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: 'Borrow record deleted and saved in history.',
                penaltyFee,
                revenue,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const returnBorrowItem = (borrowId, itemId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const borrow = await Borrow.findById(borrowId);
            if (!borrow) {
                return resolve({
                    status: 'ERR',
                    message: 'The borrow record is not found.',
                });
            }

            const item = borrow.borrowItems.id(itemId);
            if (!item) {
                return resolve({
                    status: 'ERR',
                    message: 'The borrow item is not found.',
                });
            }

            if (item.isReturned) {
                return resolve({
                    status: 'ERR',
                    message: 'This item has already been returned.',
                });
            }

            // Lấy phí phạt trễ hạn từ RuleService
            const penaltyResponse = await RuleService.getLatePenaltyFee();
            if (penaltyResponse.status !== 'OK') {
                return resolve({
                    status: 'ERR',
                    message: 'Không thể lấy phí phạt trễ hạn',
                });
            }
            const latePenaltyFee = penaltyResponse.data; // Giá trị phí phạt/ngày

            const today = new Date();
            item.isReturned = true;
            item.returnedAt = today;

            let penaltyFee = 0;
            if (today > item.returnDate) {
                const overdueDays = Math.ceil(
                    (today - item.returnDate) / (1000 * 60 * 60 * 24),
                );
                penaltyFee = overdueDays * latePenaltyFee; // Sử dụng latePenaltyFee
                item.isOverdue = true;
            }

            await Product.findOneAndUpdate(
                { _id: item.product },
                { $inc: { countInStock: item.amount } },
                { new: true },
            );

            const allReturned = borrow.borrowItems.every(
                (item) => item.isReturned,
            );
            if (allReturned) {
                borrow.isFullyReturned = true;

                const totalPenaltyFee = borrow.borrowItems.reduce(
                    (total, item) => {
                        if (
                            item.isOverdue &&
                            item.returnedAt > item.returnDate
                        ) {
                            const overdueDays = Math.ceil(
                                (item.returnedAt - item.returnDate) /
                                    (1000 * 60 * 60 * 24),
                            );
                            return total + overdueDays * latePenaltyFee; // Sử dụng latePenaltyFee
                        }
                        return total;
                    },
                    0,
                );

                const revenue = borrow.totalPrice + totalPenaltyFee;

                await DeletedBorrow.create({
                    borrowItems: borrow.borrowItems,
                    user: borrow.user,
                    borrowAddress: borrow.borrowAddress,
                    totalPrice: borrow.totalPrice,
                    penaltyFee: totalPenaltyFee,
                    revenue,
                });

                await Borrow.findByIdAndDelete(borrowId);
                return resolve({
                    status: 'OK',
                    message:
                        'All items returned, borrow record deleted and saved in history.',
                    penaltyFee,
                    revenue,
                });
            } else {
                await borrow.save();
                return resolve({
                    status: 'OK',
                    message: 'Item returned successfully.',
                    penaltyFee,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getDeletedBorrows = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedBorrows = await DeletedBorrow.find().sort({
                returnedAt: -1,
            });

            resolve({
                status: 'OK',
                message: 'Fetch deleted borrows successful',
                data: deletedBorrows,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const deleteCanceledBorrow = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedBorrow = await DeletedBorrow.findById(id);

            if (!deletedBorrow) {
                return resolve({
                    status: 'ERR',
                    message: 'Deleted borrow not found',
                });
            }

            await DeletedBorrow.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: `Deleted borrow with ID ${id} has been removed successfully`,
            });
        } catch (error) {
            reject(error);
        }
    });
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
