import Rule from '../models/RuleModel.js';

const createRule = (newRule) => {
    return new Promise(async (resolve, reject) => {
        const { title, contents, latePenaltyFee } = newRule;
        try {
            if (
                !title ||
                !contents ||
                !Array.isArray(contents) ||
                contents.length === 0
            ) {
                return resolve({
                    status: 'ERR',
                    message:
                        'Tiêu đề và nội dung là bắt buộc, nội dung phải là mảng không rỗng',
                });
            }

            if (typeof latePenaltyFee !== 'number' || latePenaltyFee < 0) {
                return resolve({
                    status: 'ERR',
                    message: 'Phí phạt trễ hạn phải là số không âm',
                });
            }

            // Tạo quy định mới
            const createRule = await Rule.create({
                title,
                contents,
                latePenaltyFee,
            });

            // Cập nhật latePenaltyFee cho tất cả các quy định khác
            await Rule.updateMany(
                { _id: { $ne: createRule._id } }, // Loại trừ quy định vừa tạo
                { $set: { latePenaltyFee } }, // Cập nhật latePenaltyFee
            );

            resolve({
                status: 'OK',
                message: 'Tạo quy định thành công',
                data: createRule,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getAllRule = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allRule = await Rule.find().sort({ createdAt: -1 });
            resolve({
                status: 'OK',
                message: 'Lấy danh sách quy định thành công',
                data: allRule,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getDetailRule = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const rule = await Rule.findOne({ _id: id });

            if (rule === null) {
                return resolve({
                    status: 'ERR',
                    message: 'Quy định không tồn tại',
                });
            }

            resolve({
                status: 'OK',
                message: 'Lấy chi tiết quy định thành công',
                data: rule,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const updateRule = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkRule = await Rule.findOne({ _id: id });

            if (checkRule === null) {
                return resolve({
                    status: 'ERR',
                    message: 'Quy định không tồn tại',
                });
            }

            const { title, contents, latePenaltyFee } = data;
            if (
                !title ||
                !contents ||
                !Array.isArray(contents) ||
                contents.length === 0
            ) {
                return resolve({
                    status: 'ERR',
                    message:
                        'Tiêu đề và nội dung là bắt buộc, nội dung phải là mảng không rỗng',
                });
            }

            if (typeof latePenaltyFee !== 'number' || latePenaltyFee < 0) {
                return resolve({
                    status: 'ERR',
                    message: 'Phí phạt trễ hạn phải là số không âm',
                });
            }

            // Cập nhật quy định hiện tại
            const updatedRule = await Rule.findByIdAndUpdate(id, data, {
                new: true,
            });

            // Cập nhật latePenaltyFee cho tất cả các quy định khác
            await Rule.updateMany(
                { _id: { $ne: id } }, // Loại trừ quy định vừa cập nhật
                { $set: { latePenaltyFee } }, // Cập nhật latePenaltyFee
            );

            resolve({
                status: 'OK',
                message: 'Cập nhật quy định thành công',
                data: updatedRule,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const deleteRule = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkRule = await Rule.findOne({ _id: id });

            if (checkRule === null) {
                return resolve({
                    status: 'ERR',
                    message: 'Quy định không tồn tại',
                });
            }

            await Rule.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: 'Xóa quy định thành công',
            });
        } catch (error) {
            reject(error);
        }
    });
};

// Hàm để lấy phí phạt trễ hạn từ quy định mới nhất
const getLatePenaltyFee = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const latestRule = await Rule.findOne().sort({ createdAt: -1 });
            if (!latestRule) {
                // Nếu không có quy định nào, trả về giá trị mặc định
                return resolve({
                    status: 'OK',
                    message:
                        'Không tìm thấy quy định, sử dụng giá trị mặc định',
                    data: 5000, // Giá trị mặc định: 5000 VNĐ/ngày
                });
            }

            resolve({
                status: 'OK',
                message: 'Lấy phí phạt trễ hạn thành công',
                data: latestRule.latePenaltyFee,
            });
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    createRule,
    getAllRule,
    getDetailRule,
    updateRule,
    deleteRule,
    getLatePenaltyFee,
};
