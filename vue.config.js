module.exports = {
    // lintOnSave: false,//关闭语法检查
    devServer: {
        port: 8081, //项目运行端口号
        host: '127.0.0.1',
        // host: '192.168.1.4',
        open: true, // 配置自动启动浏览器
        https: false,
        proxy: {
            "/api": {
                // target: "http://127.0.0.1:8888", // 对应服务端接口位置  -- 本机
                // target: "http://192.168.184.130:9001", // 对应服务端接口位置  -- 虚拟机ip  --实验室有线网络IP
                // target: "http://192.168.1.5:9001", // 对应服务端接口位置  -- 虚拟机ip  -- 家里无线网络IP
                // target: "http://192.168.1.8:9001", // 对应服务端接口位置  -- 虚拟机ip  -- 家里无线网络IP
                // target: "http://222.198.39.22:9001", // 对应服务端接口位置  -- 虚拟机ip  -- 家里无线网络IP
                target: "http://222.198.39.40:9001", // 对应服务端接口位置  -- 虚拟机ip  -- 家里无线网络IP
                ws: true,
                changeOrigin: true, // 开启跨域
                pathRewrite: {
                    "^/api": ""
                }
            }
        }
   }
}