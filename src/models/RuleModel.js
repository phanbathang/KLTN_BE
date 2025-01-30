import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        contents: [{ type: String, required: true }],
        latePenaltyFee: {
            type: Number,
            required: true,
            default: 5000, // Giá trị mặc định là 5000 VNĐ/ngày
            min: 0,
        },
    },
    {
        timestamps: true,
    },
);

const Rule = mongoose.model('Rule', ruleSchema);
export default Rule;
