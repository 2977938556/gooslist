const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 生成单个订单的辅助函数
function createSingleOrder(index) {
    // 随机生成该订单的商品数量 (1 到 15 个)
    const itemCount = Math.floor(Math.random() * 15) + 1;
    const isLarge = itemCount > 8;
    
    // 模拟不同的收货人
    const names = ['张大炮', '李云龙', '楚云飞', '赵刚', '孔捷'];
    const receiverName = names[index % names.length];

    const items = [];
    for (let i = 1; i <= itemCount; i++) {
        items.push({
            goods_id: 10000 + (index * 100) + i, // 确保ID唯一
            goods_name: `商品-${index + 1}-${i} (${isLarge ? '多件' : '少件'})`,
            spec_info: isLarge ? '批量采购规格' : '家用普通规格',
            size_info: '1800*2000mm',
            service_info: i % 2 === 0 ? '上楼' : '-',
            num: 1,
            package_num: Math.floor(Math.random() * 3) + 1
        });
    }

    return {
        order_sn: `ORD-${Date.now()}-${index + 1}`,
        created_at: new Date().toLocaleString('zh-CN'),
        consignee: receiverName,
        mobile: `138${String(index).padStart(8, '0')}`,
        full_address: `福建省莆田市测试区第 ${index + 1} 大道`,
        shipping_name: index % 2 === 0 ? '顺丰速运' : '德邦物流',
        user_name: '业务员A',
        user_phone: '13900000000',
        remark: `这是第 ${index + 1} 个订单，共 ${itemCount} 个商品。`,
        items_list: items
    };
}

// 定义接口: 获取多个订单
// 用法: /api/getOrders?count=3 (返回3个订单)
app.get('/api/getOrders', (req, res) => {
    // 获取想要生成的订单数量，默认为 3
    let orderCount = parseInt(req.query.count) || 3;
    
    // 限制一下最大数量，防止浏览器卡死
    if (orderCount > 50) orderCount = 50;

    console.log(`[请求] 生成 ${orderCount} 个模拟订单...`);

    const orders = [];
    for (let i = 0; i < orderCount; i++) {
        orders.push(createSingleOrder(i));
    }

    res.json({
        code: 200,
        message: 'success',
        data: orders // 返回数组
    });
});

app.listen(PORT, () => {
    console.log(`🚀 后端服务已启动: http://localhost:${PORT}`);
    console.log(`👉 测试地址: http://localhost:${PORT}/api/getOrders?count=3`);
});