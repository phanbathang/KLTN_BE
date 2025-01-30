import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { createVNPayPaymentUrl } from '../services/VNPayService.js';
import { createHmac } from 'crypto'; // Thêm dòng này

const router = express.Router();

dotenv.config();

router.get('/config', (req, res) => {
    return res.status(200).json({
        status: 'OK',
        data: process.env.CLIENT_ID,
    });
});

// API để lấy Access Token từ PayPal
const getAccessTokenPaypal = async () => {
    const auth = Buffer.from(
        `${process.env.CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
    ).toString('base64');

    const response = await axios.post(
        'https://api-m.sandbox.paypal.com/v1/oauth2/token',
        'grant_type=client_credentials',
        {
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
    );

    return response.data.access_token;
};

router.get('/getAccessTokenPaypal', async (req, res) => {
    try {
        const accessToken = await getAccessTokenPaypal();
        return res.status(200).json({ accessToken });
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Lỗi lấy Access Token', error: error.message });
    }
});

// API hoàn tiền đơn hàng dựa trên Capture ID
router.post('/refundPayment', async (req, res) => {
    try {
        const { captureId } = req.body; // Capture ID của giao dịch thanh toán

        if (!captureId) {
            return res.status(400).json({ message: 'Capture ID không hợp lệ' });
        }

        const accessToken = await getAccessTokenPaypal();
        const refundUrl = `https://api-m.sandbox.paypal.com/v2/payments/captures/${captureId}/refund`;

        const refundResponse = await axios.post(
            refundUrl,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        return res.status(200).json({
            message: 'Hoàn tiền thành công!',
            refundData: refundResponse.data,
        });
    } catch (error) {
        console.error('Lỗi hoàn tiền:', error.response?.data || error.message);
        return res
            .status(500)
            .json({ message: 'Hoàn tiền thất bại', error: error.message });
    }
});

router.post('/vnpay', (req, res) => {
    const paymentUrl = createVNPayPaymentUrl(req);
    res.json({ paymentUrl });
});

router.get('/vnpay/return', (req, res) => {
    const vnp_Params = req.query;
    const vnp_HashSecret = 'E0Q28F7LGVCEXDQM0QMTVZTWMXOXBJ00';
    const secureHash = vnp_Params.vnp_SecureHash;

    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    const sortedParams = Object.keys(vnp_Params)
        .sort()
        .reduce((result, key) => {
            result[key] = vnp_Params[key];
            return result;
        }, {});

    const queryString = new URLSearchParams(sortedParams).toString();
    const hmac = createHmac('sha512', vnp_HashSecret);
    const calculatedHash = hmac.update(queryString).digest('hex');

    if (secureHash === calculatedHash) {
        const orderId = vnp_Params.vnp_TxnRef;
        const responseCode = vnp_Params.vnp_ResponseCode;
        const transactionDate = vnp_Params.vnp_PayDate; // vnp_TransactionDate
        if (responseCode === '00') {
            // Redirect về PaymentPage với query parameters
            res.redirect(
                `http://localhost:3000/payment?vnp_ResponseCode=${responseCode}&vnp_TxnRef=${orderId}`,
            );
        } else {
            res.redirect(`http://localhost:3000/orderFailed?status=failed`);
        }
    } else {
        res.status(400).send('Invalid checksum');
    }
});
export default router;
