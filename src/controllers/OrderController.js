import OrderService from '../services/OrderService.js';

const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder();
        return res.status(201).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

const createOrder = async (req, res) => {
    try {
        const {
            paymentMethod,
            deliveryMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            fullName,
            address,
            phone,
        } = req.body;

        if (
            !paymentMethod ||
            !deliveryMethod ||
            !itemsPrice ||
            !shippingPrice ||
            !totalPrice ||
            !fullName ||
            !address ||
            !phone
        ) {
            return res.status(200).json({
                status: 'ERR',
                message: 'All input fields are required.',
            });
        }

        const response = await OrderService.createOrder(req.body);
        return res.status(201).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

const getAllOrderDetail = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required',
            });
        }
        const response = await OrderService.getAllOrderDetail(userId);
        return res.status(201).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

const getOrderDetail = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The orderId is required',
            });
        }
        const response = await OrderService.getOrderDetail(orderId);
        return res.status(201).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

const cancelOrderDetail = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The orderId is required',
            });
        }
        const response = await OrderService.cancelOrderDetail(orderId);
        return res.status(201).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

const getDeletedOrders = async (req, res) => {
    try {
        const data = await OrderService.getDeletedOrders();
        return res.status(201).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

const deleteCanceledOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await OrderService.deleteCanceledOrder(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

export default {
    getAllOrder,
    createOrder,
    getAllOrderDetail,
    getOrderDetail,
    cancelOrderDetail,
    getDeletedOrders,
    deleteCanceledOrder,
};
