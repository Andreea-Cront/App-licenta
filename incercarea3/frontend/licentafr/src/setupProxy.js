const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // the path you want to proxy (e.g., '/api', '/auth')
    createProxyMiddleware({
      target: 'http://localhost:8081', // the address of your Node.js server
      changeOrigin: true,
    })
  );
};
