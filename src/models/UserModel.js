import mongoose from 'mongoose';
const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        confirmPassword: { type: String, required: true },
        isAdmin: { type: Boolean, default: false, required: true },
        phone: { type: Number },
        address: { type: String },
        access_token: { type: String, require: true },
        refresh_token: { type: String, require: true },
        avatar: { type: String },
    },
    {
        timestamps: true,
    },
);
const User = mongoose.model('User', userSchema);
export default User;
