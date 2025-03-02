import Product from '../models/ProductModel.js';

// const getAllProduct = (limit, page, sort, filter) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const totalProduct = await Product.countDocuments();

//       if (filter) {
//         const label = filter[0];
//         const allObjectFilter = await Product.find({
//           [label]: { regex: filter[1] },
//         })
//           .limit(limit)
//           .skip(page * limit);
//         resolve({
//           status: "OK",
//           message: "Successful",
//           data: allObjectFilter,
//           total: totalProduct,
//           pageCurrent: Number(page) + 1,
//           totalPage: Math.ceil(totalProduct / limit),
//         });
//       }

//       if (sort) {
//         const objectSort = {};
//         objectSort[sort[1]] = sort[0];
//         const allProductSort = await Product.find()
//           .limit(limit)
//           .skip(page * limit)
//           .sort({
//             objectSort,
//           });
//         resolve({
//           status: "OK",
//           message: "Successful",
//           data: allProductSort,
//           total: totalProduct,
//           pageCurrent: Number(page) + 1,
//           totalPage: Math.ceil(totalProduct / limit),
//         });
//       }
//       const allProduct = await Product.find()
//         .limit(limit)
//         .skip(page * limit);
//       resolve({
//         status: "OK",
//         message: "Successful",
//         data: allProduct,
//         total: totalProduct,
//         pageCurrent: Number(page) + 1,
//         totalPage: Math.ceil(totalProduct / limit),
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            // limit = limit || 10; // Mặc định là 10 sản phẩm
            // page = page || 0; // Mặc định là trang đầu tiên (0)
            const totalProduct = await Product.countDocuments(); // Sửa từ count() thành countDocuments()
            let allProduct = [];

            if (filter) {
                const label = filter[0];
                const allObjectFilter = await Product.find({
                    [label]: { $regex: filter[1], $options: 'i' }, // Thêm $options: "i" để không phân biệt hoa thường
                })
                    .limit(limit)
                    .skip(page * limit)
                    .sort({ createdAt: -1, updatedAt: -1 });

                return resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit),
                });
            }

            if (sort) {
                const objectSort = {};
                objectSort[sort[1]] = sort[0];
                const allProductSort = await Product.find()
                    .limit(limit)
                    .skip(page * limit)
                    .sort(objectSort)
                    .sort({ createdAt: -1, updatedAt: -1 });

                return resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit),
                });
            }

            if (!limit) {
                allProduct = await Product.find().sort({
                    createdAt: -1,
                    updatedAt: -1,
                });
            } else {
                allProduct = await Product.find()
                    .limit(limit)
                    .skip(page * limit)
                    .sort({ createdAt: -1, updatedAt: -1 });
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit),
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct('type');
            resolve({
                status: 'OK',
                message: 'Success',
                data: allType,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({ _id: id });

            if (product === null) {
                return resolve({
                    status: 'OK',
                    message: 'The product is not defined',
                });
            }

            resolve({
                status: 'OK',
                message: 'Get detail successful',
                data: product,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const {
            name,
            image,
            type,
            countInStock,
            price,
            rating,
            description,
            discount,
            isForSale,
            isForRent,
            rentalPrice,
            rentalDuration,
        } = newProduct;
        try {
            const checkProduct = await Product.findOne({
                name: name,
            });
            if (checkProduct !== null) {
                resolve({
                    status: 'OK',
                    message: 'The name of product is already',
                });
            }
            const createProduct = await Product.create({
                name,
                image,
                type,
                countInStock: Number(countInStock),
                price,
                rating,
                description,
                discount: Number(discount),
                isForSale,
                isForRent,
                rentalPrice,
                rentalDuration,
            });
            if (createProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createProduct,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({ _id: id });

            if (checkProduct === null) {
                return resolve({
                    status: 'OK',
                    message: 'The product is not defined',
                });
            }

            const updateProduct = await Product.findByIdAndUpdate(id, data, {
                new: true,
            });

            resolve({
                status: 'OK',
                message: 'Update successful',
                data: updateProduct,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({ _id: id });

            if (checkProduct === null) {
                return resolve({
                    status: 'OK',
                    message: 'The product is not defined',
                });
            }

            await Product.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: 'Delete product successful',
            });
        } catch (error) {
            reject(error);
        }
    });
};

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids });
            resolve({
                status: 'OK',
                message: 'Delete product successful',
            });
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    getAllProduct,
    getDetailProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteManyProduct,
    getAllType,
};
