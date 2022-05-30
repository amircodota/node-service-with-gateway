const express = require('express');
const {createProxyMiddleware} = require("http-proxy-middleware");
const https = require("https");
const http = require("http");

const app = express();

const SERVICE_URL = process.env.SERVICE_URL;
const agent = SERVICE_URL.startsWith('https://') ? new https.Agent({ keepAlive: true, maxSockets: Number.MAX_VALUE }) : new http.Agent({ keepAlive: true, maxSockets: Number.MAX_VALUE });

function socketsToObj(sockets) {
    return {
        domainCount: Object.keys(sockets).length,
        count: Object.values(sockets).map(x => x.length).reduce((a, b) => a + b, 0)
    };
}

app.use('/service', createProxyMiddleware({
    target: SERVICE_URL,
    proxyTimeout: 30000,
    timeout: 30000,
    changeOrigin: true,
    xfwd: true,
    secure: process.env.SECURE !== 'false',
    agent,
    onProxyRes(proxyRes, req) {
        console.log(`PROXY agent stats`, {
            sockets: socketsToObj(agent.sockets),
            freeSockets: socketsToObj(agent.freeSockets),
            requests: socketsToObj(agent.requests),
        });
        console.log(`PROXY request`, req.headers);
        console.log('PROXY res:', proxyRes.headers);
    }
}));

app.listen(process.env.PORT || 3001);