const express = require('express');
const {createProxyMiddleware} = require("http-proxy-middleware");
const https = require("https");
const http = require("http");

const app = express();

const SERVICE_URL = process.env.SERVICE_URL;
const agent = SERVICE_URL.startsWith('https://') ? new https.Agent({ keepAlive: true, keepAliveMsecs: 60_000 }) : new http.Agent({ keepAlive: true, keepAliveMsecs: 60_000 });

const stats = {
  connectionOpen: 0,
  connectionKeptAlive: 0,
  connectionReused: 0,
  socketsClosed: 0,
  socketsRemoved: 0
};

const oldCreateConnection = agent.createConnection;
agent.createConnection = function () {
    //console.log('creating agent connection');
    stats.connectionOpen++;
    return oldCreateConnection.apply(agent, arguments);
}
const oldKeepSocketAlive = agent.keepSocketAlive;
agent.keepSocketAlive = function (socket) {
    if (!socket.__attachedEvents) {
        let handled = false;
        socket.__attachedEvents = true;
        socket.on('close', () => {
            if (!handled) {
                stats.socketsClosed++;
                handled = true;
            }
        });
        socket.on('agentRemove', () => {
            if (!handled) {
                stats.socketsRemoved++;
                handled = true;
            }
        });
    }


    //console.log('keeping agent socket alive');
    stats.connectionKeptAlive++;
    return oldKeepSocketAlive.apply(agent, arguments);
}

const oldReuseSocket = agent.reuseSocket;
agent.reuseSocket = function () {
    //console.log('reusing socket alive');
    stats.connectionReused++;
    return oldReuseSocket.apply(agent, arguments);
}

setInterval(() => {
    console.log(stats);
}, 10000);
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
/*        console.log(`PROXY agent stats`, {
            sockets: socketsToObj(agent.sockets),
            freeSockets: socketsToObj(agent.freeSockets),
            requests: socketsToObj(agent.requests),
        });
        console.log(`PROXY request`, req.headers);*/
        console.log('PROXY res:', proxyRes.headers);
    }
}));

app.listen(process.env.PORT || 3001);