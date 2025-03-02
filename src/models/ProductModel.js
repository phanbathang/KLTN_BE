import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String, required: true },
        type: { type: String, required: true },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        rating: { type: Number, required: true },
        description: { type: String },
        discount: { type: Number },
        selled: { type: Number },
        isForSale: { type: Boolean, default: false }, // Sách này có thể bán không?
        isForRent: { type: Boolean, default: false }, // Sách này có thể cho thuê không?
        rentalPrice: { type: Number }, // Giá thuê sách (nếu cho thuê)
        rentalDuration: { type: Number }, // Thời gian thuê (ngày)
    },
    {
        timestamps: true,
    },
);
const Product = mongoose.model('Product', productSchema);

export default Product;
