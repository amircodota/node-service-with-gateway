const express = require('express');
const {createProxyMiddleware} = require("http-proxy-middleware");
const https = require("https");

const app = express();

const agent = new https.Agent({ keepAlive: true });

app.use('/service', createProxyMiddleware({
    target: process.env.SERVICE_URL,
    proxyTimeout: 30000,
    timeout: 30000,
    changeOrigin: true,
    xfwd: true,
    secure: true,
    agent
}));

app.listen(process.env.PORT || 3001);