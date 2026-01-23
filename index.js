// 主入口文件
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDatabase } = require('./config/database');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(express.json());

// 路由配置
app.use('/api', orderRoutes);

// 启动服务
async function startServer() {
    try {
        // 连接数据库
        await connectDatabase();

        // 启动 HTTP 服务
        app.listen(PORT, () => {
            console.log('=========================================');
            console.log(`🚀 后端服务已启动!`);
            console.log(`📍 接口地址: http://localhost:${PORT}/api/getOrder?id=1`);
            console.log('=========================================');
        });
    } catch (error) {
        console.error('启动服务器失败:', error);
        process.exit(1);
    }
}

// 优雅关闭
process.on('SIGINT', async () => {
    console.log('\n正在关闭服务器...');
    const { closeDatabase } = require('./config/database');
    await closeDatabase();
    process.exit(0);
});

startServer();
