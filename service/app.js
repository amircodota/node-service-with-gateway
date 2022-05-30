const express = require('express');
const fs = require("fs");
const https = require("https");

const app = express();

app.get('/service/req', (req, res) => {
   setTimeout(() => {
       res.sendStatus(200);
   }, 100);
});

const port = process.env.PORT || 3000;

if (process.env.SSL === 'true') {
    const key = fs.readFileSync(__dirname + '/./certs/selfsigned.key');
    const cert = fs.readFileSync(__dirname + '/./certs/selfsigned.crt');
    const options = {
        key: key,
        cert: cert
    };

    const server = https.createServer(options, app);
    server.listen(port);
} else {
    app.listen(port);
}