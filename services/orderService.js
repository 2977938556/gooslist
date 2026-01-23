// 订单服务层 - 处理订单相关的业务逻辑
const RequestLog = require('../models/RequestLog');

/**
 * 解析设备信息
 * @param {string} userAgent - UA字符串
 * @returns {Object} 设备信息对象
 */
function parseDeviceInfo(userAgent) {
    let device = 'Desktop';
    let deviceType = 'Desktop';
    let browser = 'Unknown';
    let os = 'Unknown';

    // 检测浏览器
    if (userAgent.includes('Chrome')) {
        browser = 'Chrome';
    } else if (userAgent.includes('Safari')) {
        browser = 'Safari';
    } else if (userAgent.includes('Firefox')) {
        browser = 'Firefox';
    } else if (userAgent.includes('Edge')) {
        browser = 'Edge';
    }

    // 检测操作系统
    if (userAgent.includes('Windows')) {
        os = 'Windows';
    } else if (userAgent.includes('Mac OS')) {
        os = 'macOS';
    } else if (userAgent.includes('Linux')) {
        os = 'Linux';
    } else if (userAgent.includes('Android')) {
        os = 'Android';
        device = 'Mobile';
        deviceType = 'Android Phone';
    } else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        os = 'iOS';
        device = userAgent.includes('iPad') ? 'Tablet' : 'Mobile';
        deviceType = userAgent.includes('iPad') ? 'iPad' : 'iPhone';
    }

    return { device, deviceType, browser, os };
}

/**
 * 保存请求日志到数据库
 * @param {string} orderId - 请求的订单ID
 * @param {string} userAgent - 用户代理字符串
 * @param {string} ip - IP地址
 * @param {string} path - 请求路径
 */
async function saveRequestLog(orderId, userAgent, ip, path) {
    try {
        const { device, deviceType, browser, os } = parseDeviceInfo(userAgent);
        
        const log = new RequestLog({
            requestTime: new Date(),
            orderId: orderId,
            device: `${deviceType} - ${browser} on ${os}`,
            deviceType,
            browser,
            os,
            ip: ip || 'Unknown',
            path: path || '/api/getOrder'
        });

        await log.save();
        console.log(`[Log] 请求日志已保存: OrderID=${orderId}, Device=${log.device}`);
    } catch (error) {
        console.error('[Log] 保存请求日志失败:', error);
    }
}

/**
 * 模拟数据库数据生成函数
 * @param {string|number} orderId - 订单ID
 * @returns {Object} 订单数据对象
 */
function generateMockOrder(orderId) {
    // 随机生成商品数量（1-15个商品）
    const itemCount = Math.floor(Math.random() * 15) + 1;
    
    // 判断是否为"大订单"（数量大于8），用于前端展示不同的样式
    const isLargeOrder = itemCount > 8; 
    
    // 初始化一个数组，用于存放商品列表
    const items = [];
    
    // 循环生成指定数量的商品数据
    for (let i = 1; i <= itemCount; i++) {
        items.push({
            // 生成模拟的商品 ID
            goods_id: 1000 + i,
            // 根据是否为大订单，生成不同的商品名称
            goods_name: `API动态商品 - ${isLargeOrder ? '大量测试款' : '普通款'} ${String.fromCharCode(64 + (i % 26 || 26))}`,
            // 根据是否为大订单，生成不同的规格信息
            spec_info: isLargeOrder ? '双联打印测试规格' : '1.8米大床 / 胡桃木',
            // 固定的尺寸信息
            size_info: '1800*2000*450mm',
            // 偶数个商品显示服务信息，奇数个不显示
            service_info: i % 2 === 0 ? '升级乳胶垫' : '-',
            // 商品数量默认为 1
            num: 1,
            // 随机生成包裹数量 (1-3个)
            package_num: Math.floor(Math.random() * 3) + 1
        });
    }

    // 返回构建好的订单对象
    return {
        // 生成模拟的订单编号
        order_sn: `ORDER-${orderId}-${Date.now().toString().slice(-6)}`,
        // 创建时间为当前时间
        created_at: new Date().toLocaleString('zh-CN'),
        // 根据是否为大订单，生成不同的收货人姓名
        consignee: isLargeOrder ? `李分页(共${itemCount}件)` : `张三丰(共${itemCount}件)`,
        // 固定的手机号
        mobile: '13800138000',
        // 固定的收货地址
        full_address: '广东省深圳市南山区科技园阿里云大厦10楼后端开发部',
        // 固定的快递公司名称
        shipping_name: '顺丰速运',
        // 固定的业务员姓名
        user_name: '王销售',
        // 固定的业务员电话
        user_phone: '13912345678',
        // 根据是否为大订单，生成不同的备注信息
        remark: isLargeOrder
            ? `这是一个包含 ${itemCount} 个商品的测试订单，用于测试双联打印和自动分页功能是否正常。` 
            : '请送货上门，到了打电话。',
        // 将生成的商品列表赋值给 items_list 字段
        items_list: items
    };
}

/**
 * 获取单个订单服务
 * @param {string|number} orderId - 订单ID
 * @param {Object} requestInfo - 请求信息
 * @param {string} requestInfo.userAgent - 用户代理
 * @param {string} requestInfo.ip - IP地址
 * @param {string} requestInfo.path - 请求路径
 * @returns {Object} 订单数据
 */
async function getOrder(orderId, requestInfo = {}) {
    console.log(`[Service] 正在获取订单 ID: ${orderId}`);
    
    // 保存请求日志（异步，不影响返回数据）
    await saveRequestLog(
        orderId,
        requestInfo.userAgent || 'Unknown',
        requestInfo.ip || 'Unknown',
        requestInfo.path || '/api/getOrder'
    );
    
    return generateMockOrder(orderId);
}

/**
 * 批量获取订单服务
 * @param {number} count - 订单数量
 * @param {Object} requestInfo - 请求信息
 * @returns {Array} 订单数组
 */
async function getOrders(count = 3, requestInfo = {}) {
    console.log(`[Service] 正在批量获取订单，数量: ${count}`);
    
    const orders = [];
    for (let i = 1; i <= count; i++) {
        // 每个订单使用不同的ID
        const order = generateMockOrder(i);
        orders.push(order);
        
        // 保存请求日志
        await saveRequestLog(
            String(i),
            requestInfo.userAgent || 'Unknown',
            requestInfo.ip || 'Unknown',
            requestInfo.path || '/api/getOrders'
        );
    }
    
    return orders;
}

module.exports = {
    getOrder,
    getOrders
};
