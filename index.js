const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 辅助函数：获取真实客户端 IP（兼容代理/Render 环境）
function getClientIP(req) {
  // Render、Vercel、Railway 等平台通常通过 X-Forwarded-For 传递真实 IP
  return req.headers['x-forwarded-for'] 
    ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
}

// 辅助函数：从 User-Agent 简单判断设备类型
function getDeviceType(userAgent) {
  if (!userAgent) return 'unknown';
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'Tablet';
  } else {
    return 'Desktop';
  }
}

// 生成订单的函数（保持不变）
function createSingleOrder(index) {
  const itemCount = Math.floor(Math.random() * 15) + 1;
  const isLarge = itemCount > 8;
  const names = ['张大炮', '李云龙', '楚云飞', '赵刚', '孔捷'];
  const receiverName = names[index % names.length];

  const items = [];
  for (let i = 1; i <= itemCount; i++) {
    items.push({
      goods_id: 10000 + (index * 100) + i,
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

// API 路由：在每次请求时打印客户端信息
app.get('/api/getOrders', (req, res) => {
  const clientIP = getClientIP(req);
  const userAgent = req.get('User-Agent') || 'unknown';
  const deviceType = getDeviceType(userAgent);

  console.log(`[新请求]`);
  console.log(`  📡 客户端 IP: ${clientIP}`);
  console.log(`  🖥️ 设备类型: ${deviceType}`);
  console.log(`  🌐 User-Agent: ${userAgent.substring(0, 80)}...`);

  let orderCount = parseInt(req.query.count) || 3;
  if (orderCount > 50) orderCount = 50;

  const orders = [];
  for (let i = 0; i < orderCount; i++) {
    orders.push(createSingleOrder(i));
  }

  res.json({
    code: 200,
    message: 'success',
    data: orders
  });
});

// 服务器启动日志（只打印服务地址，不包含请求信息）
app.listen(PORT, () => {
  console.log(`🚀 后端服务已启动: http://localhost:${PORT}`);
  console.log(`👉 测试地址: http://localhost:${PORT}/api/getOrders?count=3`);
});