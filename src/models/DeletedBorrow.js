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
                borrowDate: { type: Date },
                returnDate: { type: Date },
                isReturned: { type: Boolean, default: true },
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
            phone: { type: String, required: true }, // Sửa thành String
            address: { type: String, required: true },
        },
        totalPrice: { type: Number, required: true },
        penaltyFee: { type: Number, default: 0 },
        returnedAt: { type: Date, default: Date.now },
        revenue: { type: Number, required: true },
    },
    {
        timestamps: true,
    },
);

const DeletedBorrow = mongoose.model('DeletedBorrow', deletedBorrowSchema);

export default DeletedBorrow;
