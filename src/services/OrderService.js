import Order from '../models/OrderModel.js';
import Product from '../models/ProductModel.js';
import DeletedOrder from '../models/DeletedOrder.js';
import { sendEmailCreateOrder } from '../services/EmailService.js';

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find().sort({ createdAt: -1 });
            resolve({
                status: 'OK',
                message: 'Successful',
                data: allOrder,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const {
            orderItems,
            paymentMethod,
            deliveryMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            fullName,
            address,
            phone,
            user,
            isPaid,
            paidAt,
            email,
        } = newOrder;
        try {
            // Kiểm tra đủ hàng cho tất cả sản phẩm trong đơn hàng
            const productsToUpdate = orderItems.map(async (order) => {
                return Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount },
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            selled: +order.amount,
                        },
                    },
                    {
                        new: true,
                    },
                );
            });

            // Đợi tất cả sản phẩm được cập nhật
            const updatedProducts = await Promise.all(productsToUpdate);

            // Kiểm tra nếu có sản phẩm nào không đủ hàng
            const outOfStockProducts = updatedProducts.filter(
                (product, index) => !product, // Nếu không có sản phẩm (tức là không đủ hàng)
            );

            if (outOfStockProducts.length > 0) {
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id${outOfStockProducts.join(
                        ',',
                    )} không đủ hàng`,
                });
                return;
            }

            // Tạo đơn hàng với tất cả sản phẩm trong orderItems
            const createdOrder = await Order.create({
                orderItems,
                shippingAddress: {
                    fullName,
                    address,
                    phone,
                },
                paymentMethod,
                deliveryMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                user: user,
                isPaid,
                paidAt,
            });

            await sendEmailCreateOrder(email, orderItems);
            resolve({
                status: 'OK',
                message: 'Success',
                createdOrder,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getAllOrderDetail = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({ user: id });

            if (order === null) {
                return resolve({
                    status: 'OK',
                    message: 'The order is not defined',
                });
            }

            resolve({
                status: 'OK',
                message: 'Get detail successful',
                data: order,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getOrderDetail = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({ _id: id });

            if (order === null) {
                return resolve({
                    status: 'OK',
                    message: 'The order is not defined',
                });
            }

            resolve({
                status: 'OK',
                message: 'Get detail successful',
                data: order,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const cancelOrderDetail = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tìm đơn hàng cần xóa
            const order = await Order.findById(id);
            if (!order) {
                return resolve({
                    status: 'ERR',
                    message: 'The order is not defined',
                });
            }

            // Cập nhật lại số lượng hàng trong kho trước khi xóa đơn hàng
            const promises = order.orderItems.map(async (item) => {
                return Product.findOneAndUpdate(
                    { _id: item.product, selled: { $gte: item.amount } },
                    {
                        $inc: {
                            selled: -item.amount, // Giảm selled
                            countInStock: +item.amount, // Tăng lại số lượng trong kho
                        },
                    },
                    { new: true },
                );
            });

            // Chờ tất cả cập nhật hoàn thành
            await Promise.all(promises);

            // Lưu thông tin đơn hàng vào collection "DeletedOrders"
            await DeletedOrder.create({
                orderItems: order.orderItems,
                shippingAddress: order.shippingAddress,
                paymentMethod: order.paymentMethod,
                itemsPrice: order.itemsPrice,
                shippingPrice: order.shippingPrice,
                totalPrice: order.totalPrice,
                user: order.user,
                isPaid: order.isPaid,
                paidAt: order.paidAt,
                deletedAt: new Date(),
            });

            // Xóa đơn hàng khỏi collection "Order"
            await Order.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: 'Order deleted and saved in history',
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getDeletedOrders = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedOrders = await DeletedOrder.find().sort({
                deletedAt: -1,
            });
            resolve({
                status: 'OK',
                message: 'Fetch deleted orders successful',
                data: deletedOrders,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const deleteCanceledOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedOrder = await DeletedOrder.findById(id);

            if (!deletedOrder) {
                return resolve({
                    status: 'ERR',
                    message: 'Deleted order not found',
                });
            }

            await DeletedOrder.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: `Deleted order with ID ${id} has been removed successfully`,
            });
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    getAllOrder,
    createOrder,
    getAllOrderDetail,
    getOrderDetail,
    cancelOrderDetail,
    getDeletedOrders,
    deleteCanceledOrder,
};
