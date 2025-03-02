import mongoose from 'mongoose';

const deletedBorrowSchema = new mongoose.Schema(
    {
        borrowItems: [
            {
                name: { type: String, required: true },
                amount: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
            },
        ],

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        borrowAddress: {
            fullName: { type: String, required: true },
            phone: { type: Number, required: true },
            address: { type: String, required: true },
        },
        borrowDate: { type: Date, default: Date.now }, // Ngày mượn
        returnDate: { type: Date, required: true }, // Ngày phải trả
        isReturned: { type: Boolean, default: false }, // Trạng thái đã trả hay chưa
        // returnedAt: { type: Date }, // Ngày thực trả
        isOverdue: { type: Boolean, default: false }, // Trạng thái quá hạn
        totalPrice: { type: Number, required: true },
        returnedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    },
);

const DeletedBorrow = mongoose.model('DeletedBorrow ', deletedBorrowSchema);

export default DeletedBorrow;
