// 请求日志模型
const mongoose = require('mongoose');

const requestLogSchema = new mongoose.Schema({
    // 请求时间
    requestTime: {
        type: Date,
        default: Date.now,
        index: true
    },
    // 请求的订单ID
    orderId: {
        type: String,
        required: true
    },
    // 请求设备信息
    device: {
        type: String,
        required: true
    },
    // 设备类型（从UA中解析）
    deviceType: {
        type: String,
        default: 'Unknown'
    },
    // 浏览器信息
    browser: {
        type: String,
        default: 'Unknown'
    },
    // 操作系统
    os: {
        type: String,
        default: 'Unknown'
    },
    // 请求IP地址
    ip: {
        type: String
    },
    // 请求路径
    path: {
        type: String
    }
}, {
    timestamps: true
});

// 创建索引以便查询
requestLogSchema.index({ createdAt: -1 });
requestLogSchema.index({ orderId: 1 });

const RequestLog = mongoose.model('RequestLog', requestLogSchema);

module.exports = RequestLog;
