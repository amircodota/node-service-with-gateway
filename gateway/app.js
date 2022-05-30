const express = require('express');
const {createProxyMiddleware} = require("http-proxy-middleware");
const https = require("https");
const http = require("http");

const app = express();

const SERVICE_URL = process.env.SERVICE_URL;
const agent = SERVICE_URL.startsWith('https://') ? new https.Agent({ keepAlive: true }) : new http.Agent({ keepAlive: true });

app.use('/service', createProxyMiddleware({
    target: SERVICE_URL,
    proxyTimeout: 30000,
    timeout: 30000,
    changeOrigin: true,
    xfwd: true,
    secure: true,
    agent
}));

app.listen(process.env.PORT || 3001);