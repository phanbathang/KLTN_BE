<<<<<<< HEAD
import axios from 'axios';

export const getAllOrder = async (access_token) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/order/getAllOrder`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        },
    );
    return res.data;
};

export const createOrder = async (data, access_token) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/order/createOrder`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        },
    );
    return res.data;
};

export const getAllOrderDetail = async (id, access_token) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/order/getAllOrderDetail/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        },
    );
    return res.data;
};

export const getOrderDetail = async (id, access_token) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/order/getOrderDetail/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        },
    );
    return res.data;
};

export const cancelOrderDetail = async (id, access_token) => {
    const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/order/cancelOrderDetail/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        },
    );
    return res.data;
=======
import Order from "../models/OrderProduct.js";
import Product from "../models/ProductModel.js";
import { sendEmailCreateOrder } from "../services/EmailService.js"; // Sử dụng default import

const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find();
      resolve({
        status: "OK",
        message: "Successful",
        data: allOrder,
      });
    } catch (error) {
      reject(error);
    }
  });
};

// const createOrder = (newOrder) => {
//   return new Promise(async (resolve, reject) => {
//     const {
//       orderItems,
//       paymentMethod,
//       itemsPrice,
//       shippingPrice,
//       totalPrice,
//       fullName,
//       address,
//       city,
//       phone,
//       user,
//       isPaid,
//       paidAt,
//       email,
//     } = newOrder;
//     try {
//       const promises = orderItems.map(async (order) => {
//         const productData = await Product.findOneAndUpdate(
//           {
//             _id: order.product,
//             countInStock: { $gte: order.amount },
//           },

//           {
//             $inc: {
//               countInStock: -order.amount,
//               selled: +order.amount,
//             },
//           },

//           {
//             new: true,
//           }
//         );

//         if (productData) {
//           return {
//             status: "OK",
//             message: "SUCCESS",
//           };
//         } else {
//           return {
//             status: "OK",
//             message: "ERROR",
//             id: order.product,
//           };
//         }
//       });
//       const results = await Promise.all(promises);
//       const newData = results && results.filter((item) => item.id);
//       if (newData.length) {
//         const arrId = [];
//         newData.forEach((item) => {
//           arrId.push(item.id);
//         });
//         resolve({
//           status: "ERR",
//           message: `Sản phẩm với id${newData.join(",")} không đủ hàng`,
//         });
//       } else {
//         const createdOrder = await Order.create({
//           orderItems,
//           shippingAddress: {
//             fullName,
//             address,
//             city,
//             phone,
//           },
//           paymentMethod,
//           itemsPrice,
//           shippingPrice,
//           totalPrice,
//           user: user,
//           isPaid,
//           paidAt,
//         });
//         if (createdOrder) {
//           await sendEmailCreateOrder(email, orderItems);
//           resolve({
//             status: "OK",
//             message: "Success",
//           });
//         }
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
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
          }
        );
      });

      // Đợi tất cả sản phẩm được cập nhật
      const updatedProducts = await Promise.all(productsToUpdate);

      // Kiểm tra nếu có sản phẩm nào không đủ hàng
      const outOfStockProducts = updatedProducts.filter(
        (product, index) => !product // Nếu không có sản phẩm (tức là không đủ hàng)
      );

      if (outOfStockProducts.length > 0) {
        resolve({
          status: "ERR",
          message: `Sản phẩm với id${outOfStockProducts.join(
            ","
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
          city,
          phone,
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        user: user,
        isPaid,
        paidAt,
      });

      await sendEmailCreateOrder(email, orderItems);
      resolve({
        status: "OK",
        message: "Success",
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
          status: "OK",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Get detail successful",
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
          status: "OK",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Get detail successful",
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
      // Lấy chi tiết đơn hàng trước khi xóa
      const order = await Order.findById(id);

      if (!order) {
        return resolve({
          status: "OK",
          message: "The order is not defined",
        });
      }

      // Lặp qua từng sản phẩm trong đơn hàng để cập nhật lại selled và countInStock
      const promises = order.orderItems.map(async (item) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: item.product,
            selled: { $gte: item.amount }, // Đảm bảo selled hiện tại hợp lệ
          },
          {
            $inc: {
              selled: -item.amount, // Giảm selled
              countInStock: +item.amount, // Tăng lại số lượng trong kho
            },
          },
          { new: true }
        );

        if (!productData) {
          return {
            status: "ERR",
            message: `Product with ID ${item.product} not found or insufficient selled value.`,
          };
        }
      });

      // Chờ tất cả các cập nhật sản phẩm hoàn tất
      const results = await Promise.all(promises);

      // Xóa đơn hàng sau khi cập nhật xong
      await Order.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Cancel detail successful",
        data: order,
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
>>>>>>> f8bcc43 (backend)
};
