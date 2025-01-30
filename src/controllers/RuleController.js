import RuleService from '../services/RuleService.js';

const createRule = async (req, res) => {
    try {
        const { title, contents, latePenaltyFee } = req.body;
        if (!title || !contents || !latePenaltyFee) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Tiêu đề, nội dung và phí phạt là bắt buộc',
            });
        }

        const response = await RuleService.createRule(req.body);
        return res.status(201).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server',
        });
    }
};

const getAllRule = async (req, res) => {
    try {
        const response = await RuleService.getAllRule();
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server',
        });
    }
};

const getDetailRule = async (req, res) => {
    try {
        const ruleId = req.params.id;
        if (!ruleId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'ID quy định là bắt buộc',
            });
        }
        const response = await RuleService.getDetailRule(ruleId);
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server',
        });
    }
};

const updateRule = async (req, res) => {
    try {
        const ruleId = req.params.id;
        const data = req.body;
        if (!ruleId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'ID quy định là bắt buộc',
            });
        }
        const response = await RuleService.updateRule(ruleId, data);
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server',
        });
    }
};

const deleteRule = async (req, res) => {
    try {
        const ruleId = req.params.id;
        if (!ruleId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'ID quy định là bắt buộc',
            });
        }
        const response = await RuleService.deleteRule(ruleId);
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server',
        });
    }
};

export default {
    createRule,
    getAllRule,
    getDetailRule,
    updateRule,
    deleteRule,
};
