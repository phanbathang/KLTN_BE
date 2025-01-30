// backend/services/VNPayService.js
import { createHmac } from 'crypto';
import axios from 'axios';

// Thông tin cấu hình VNPay
const vnp_TmnCode = 'QL8NK4TI';
const vnp_HashSecret = 'E0Q28F7LGVCEXDQM0QMTVZTWMXOXBJ00';
const vnp_PaymentUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

// Hàm tạo URL thanh toán VNPay
const createVNPayPaymentUrl = (req) => {
    const { amount, orderId, ipAddr } = req.body;

    const vnp_ReturnUrl = 'http://localhost:3000/orderSuccess';
    const date = new Date();
    const createDate = date.toISOString().replace(/[-:T]/g, '').slice(0, 14);

    let vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: vnp_TmnCode,
        vnp_Amount: amount * 100,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
        vnp_OrderType: '250000',
        vnp_Locale: 'vn',
        vnp_ReturnUrl: vnp_ReturnUrl,
        vnp_IpAddr: ipAddr || '127.0.0.1',
        vnp_CreateDate: createDate,
    };

    const sortedParams = Object.keys(vnp_Params)
        .sort()
        .reduce((result, key) => {
            result[key] = vnp_Params[key];
            return result;
        }, {});

    const queryString = new URLSearchParams(sortedParams).toString();
    const hmac = createHmac('sha512', vnp_HashSecret);
    const vnp_SecureHash = hmac.update(queryString).digest('hex');

    sortedParams.vnp_SecureHash = vnp_SecureHash;

    const paymentUrl = `${vnp_PaymentUrl}?${new URLSearchParams(
        sortedParams,
    ).toString()}`;
    return paymentUrl;
};

export { createVNPayPaymentUrl };
