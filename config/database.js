// 数据库配置文件
const mongoose = require('mongoose');

// 从环境变量中获取 MongoDB 连接字符串
const MONGO_URI = process.env.MONGO_URI;

/**
 * 连接 MongoDB 数据库
 * @returns {Promise<mongoose.Connection>}
 */
async function connectDatabase() {
    console.log('正在连接数据库...');
    
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB 数据库连接成功！');
        return mongoose.connection;
    } catch (err) {
        console.error('❌ MongoDB 连接失败:', err);
        throw err;
    }
}

/**
 * 关闭数据库连接
 */
async function closeDatabase() {
    try {
        await mongoose.connection.close();
        console.log('数据库连接已关闭');
    } catch (err) {
        console.error('关闭数据库连接失败:', err);
    }
}

module.exports = {
    connectDatabase,
    closeDatabase
};
