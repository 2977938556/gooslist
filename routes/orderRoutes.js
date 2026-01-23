// 订单路由模块
const express = require('express');
const orderService = require('../services/orderService');

const router = express.Router();

/**
 * GET /api/getOrder
 * 获取订单接口
 * 请求示例: http://localhost:3000/api/getOrder?id=10
 */
router.get('/getOrder', async (req, res) => {
    const { id } = req.query;
    
    console.log(`[收到请求] 正在获取订单 ID: ${id}`);

    if (!id) {
        return res.status(400).json({ code: 400, message: '请提供 id 参数' });
    }

    try {
        // 收集请求信息
        const requestInfo = {
            userAgent: req.get('User-Agent') || 'Unknown',
            ip: req.ip || req.connection.remoteAddress || 'Unknown',
            path: req.path
        };

        // 传递请求信息给服务层
        const data = await orderService.getOrder(id, requestInfo);

        res.json({
            code: 200,
            message: 'success',
            data: data
        });
    } catch (error) {
        console.error('获取订单失败:', error);
        res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
});

/**
 * GET /api/getOrders
 * 批量获取订单接口
 * 请求示例: http://localhost:3000/api/getOrders?count=3
 */
router.get('/getOrders', async (req, res) => {
    let { count } = req.query;

    // 默认3个订单
    if (!count) {
        count = 3;
    } else {
        count = parseInt(count);
        // 限制最多20个订单
        if (isNaN(count) || count < 1) count = 1;
        if (count > 20) count = 20;
    }

    console.log(`[收到请求] 正在批量获取订单，数量: ${count}`);

    try {
        // 收集请求信息
        const requestInfo = {
            userAgent: req.get('User-Agent') || 'Unknown',
            ip: req.ip || req.connection.remoteAddress || 'Unknown',
            path: req.path
        };

        // 传递请求信息给服务层
        const data = await orderService.getOrders(count, requestInfo);

        res.json({
            code: 200,
            message: 'success',
            data: data
        });
    } catch (error) {
        console.error('获取订单列表失败:', error);
        res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
});

module.exports = router;
