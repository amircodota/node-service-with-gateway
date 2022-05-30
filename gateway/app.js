const express = require('express');
const {createProxyMiddleware} = require("http-proxy-middleware");

const app = express();

app.use('/service', createProxyMiddleware({
    target: process.env.SERVICE_URL,
    proxyTimeout: 30000,
    timeout: 30000
}));

app.listen(process.env.PORT || 3001);