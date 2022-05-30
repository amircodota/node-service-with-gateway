const express = require('express');

const app = express();

app.get('/service/req', (req, res) => {
   setTimeout(() => {
       res.sendStatus(200);
   }, 100);
});

app.listen(process.env.PORT || 3000);