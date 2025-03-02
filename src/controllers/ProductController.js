// import { createUser, loginUser } from "../services/UserService.js";
import ProductService from '../services/ProductService.js';

const getAllProduct = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query;
        const response = await ProductService.getAllProduct(
            Number(limit) || null,
            Number(page) || 0,
            sort,
            filter,
        );
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const getAllType = async (req, res) => {
    try {
        const response = await ProductService.getAllType();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const getDetailProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The productId is required',
            });
        }
        const response = await ProductService.getDetailProduct(productId);
        return res.status(201).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const {
            name,
            image,
            type,
            countInStock,
            price,
            rating,
            description,
            discount,
            isForSale,
            isForRent,
            rentalPrice,
            rentalDuration,
        } = req.body;

        if (
            !name ||
            !image ||
            !type ||
            !countInStock ||
            !price ||
            !rating ||
            !discount ||
            !isForSale ||
            !isForRent ||
            !rentalPrice ||
            !rentalDuration
        ) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All input fields are required.',
            });
        }

        const response = await ProductService.createProduct(req.body);
        return res.status(201).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const data = req.body;
        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The productId is required',
            });
        }
        const response = await ProductService.updateProduct(productId, data);
        return res.status(201).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The productId is requireed',
            });
        }
        const response = await ProductService.deleteProduct(productId);
        return res.status(201).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

const deleteManyProduct = async (req, res) => {
    try {
        const ids = req.body.ids;
        if (!ids) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The ids is requireed',
            });
        }
        const response = await ProductService.deleteManyProduct(ids);
        return res.status(201).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error.',
        });
    }
};

export default {
    getAllProduct,
    getDetailProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteManyProduct,
    getAllType,
};
