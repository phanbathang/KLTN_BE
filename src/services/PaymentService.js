import axios from 'axios';

export const getConfig = async () => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/payment/config`,
    );
    return res.data;
};

export const getAccessTokenPaypal = async () => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/payment/getAccessTokenPaypal`,
    );
    return res.data;
};

export const refundOrder = async (captureId) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/payment/refundPayment`,
        { captureId },
    );
    return res.data;
};
