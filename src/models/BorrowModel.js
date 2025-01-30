import mongoose from 'mongoose';

const borrowSchema = new mongoose.Schema(
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
                borrowDate: { type: Date, default: Date.now }, // Ngày mượn
                returnDate: { type: Date, required: true }, // Ngày phải trả
                borrowDuration: { type: Number, min: 1, max: 30 },
                isReturned: { type: Boolean, default: false },
                returnedAt: { type: Date },
                isOverdue: { type: Boolean, default: false },
            },
        ],

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        borrowAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
        },
        totalPrice: { type: Number, required: true },
        isFullyReturned: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

const Borrow = mongoose.model('Borrow', borrowSchema);

export default Borrow;
