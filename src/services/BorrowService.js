import Borrow from '../models/BorrowModel.js';
import Product from '../models/ProductModel.js';
import DeletedBorrow from '../models/DeletedBorrow.js';

const getAllBorrows = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allBorrow = await Borrow.find().sort({ createdAt: -1 });
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
        const {
            user,
            borrowItems,
            borrowDate,
            returnDate,
            borrowAddress,
            totalPrice,
        } = newBorrow;

        const parsedBorrowDate = new Date(borrowDate);
        const parsedReturnDate = new Date(returnDate);

        // Kiểm tra ngày hợp lệ
        if (
            isNaN(parsedBorrowDate.getTime()) ||
            isNaN(parsedReturnDate.getTime())
        ) {
            return {
                status: 'ERR',
                message: 'Invalid date format. Please use YYYY-MM-DD format.',
            };
        }

        // Kiểm tra dữ liệu đầu vào có đủ không
        if (
            !user ||
            !borrowItems ||
            borrowItems.length === 0 ||
            !borrowAddress ||
            !borrowAddress.fullName ||
            !borrowAddress.phone ||
            !borrowAddress.address ||
            !parsedBorrowDate ||
            !parsedReturnDate ||
            !totalPrice
        ) {
            return { status: 'ERR', message: 'All input fields are required.' };
        }

        // Kiểm tra từng sản phẩm trong borrowItems
        for (let item of borrowItems) {
            if (
                !item.name ||
                !item.amount ||
                !item.image ||
                !item.price ||
                !item.product
            ) {
                return {
                    status: 'ERR',
                    message:
                        'Each borrow item must have name, amount, image, price, and product ID.',
                };
            }

            // Cập nhật số lượng sản phẩm trong kho
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

        // Tạo bản ghi mượn với đầy đủ trường
        const createdBorrow = await Borrow.create({
            user,
            borrowItems,
            borrowAddress,
            borrowDate: parsedBorrowDate,
            returnDate: parsedReturnDate,
            isReturned: false, // Mặc định chưa trả sách
            returnedAt: null,
            isOverdue: false, // Chưa quá hạn khi mới tạo
            totalPrice,
        });

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

            if (!borrows || borrows.length === 0) {
                return resolve({
                    status: 'ERR',
                    message: 'No borrow records found.',
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

            // Hoàn trả sách về kho
            const promises = borrow.borrowItems.map(async (item) => {
                return Product.findOneAndUpdate(
                    { _id: item.product },
                    { $inc: { countInStock: item.amount } },
                    { new: true },
                );
            });

            await Promise.all(promises);

            // Lưu thông tin vào DeletedBorrows
            await DeletedBorrow.create({
                borrowItems: borrow.borrowItems,
                user: borrow.user,
                borrowAddress: borrow.borrowAddress,
                borrowDate: borrow.borrowDate,
                returnDate: borrow.returnDate,
                isReturned: true,
                returnedAt: new Date(),
                isOverdue: borrow.isOverdue,
                totalPrice: borrow.totalPrice,
            });

            // Xóa bản ghi mượn khỏi collection "Borrow"
            await Borrow.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: 'Borrow record deleted and saved in history.',
            });
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
    getDeletedBorrows,
    deleteCanceledBorrow,
};
