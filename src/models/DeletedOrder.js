import mongoose from 'mongoose';

const deleteOrderSchema = new mongoose.Schema(
    {
        orderItems: [
            {
                name: { type: String, required: true },
                amount: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                discount: { type: Number },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
            },
        ],
        shippingAddress: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            phone: { type: Number, required: true },
        },
        paymentMethod: { type: String, required: true },
        itemsPrice: { type: Number, required: true },
        shippingPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, default: false },
        deliveredAt: { type: Date },
        isDeleted: { type: Boolean, default: false }, // Đánh dấu đơn hàng đã bị xóa
        deletedAt: { type: Date, default: Date.now }, // Lưu thời gian đơn hàng bị xóa
    },
    {
        timestamps: true,
    },
);
const DeletedOrder = mongoose.model('DeletedOrder ', deleteOrderSchema);

export default DeletedOrder;
