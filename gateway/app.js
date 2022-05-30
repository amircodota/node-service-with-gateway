const express = require('express');
const {createProxyMiddleware} = require("http-proxy-middleware");
const https = require("https");
const http = require("http");

const app = express();

const SERVICE_URL = process.env.SERVICE_URL;
const agent = SERVICE_URL.startsWith('https://') ? new https.Agent({ keepAlive: true, maxSockets: Number.MAX_VALUE }) : new http.Agent({ keepAlive: true, maxSockets: Number.MAX_VALUE });

app.use('/service', createProxyMiddleware({
    target: SERVICE_URL,
    proxyTimeout: 30000,
    timeout: 30000,
    changeOrigin: true,
    xfwd: true,
    secure: process.env.SECURE !== 'false',
    agent,
    onProxyRes(proxyRes, req) {
        console.log(`PROXY request`, req.headers);
        console.log('PROXY res:', proxyRes.headers);
    }
}));

app.listen(process.env.PORT || 3001);