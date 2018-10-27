const express = require('express');
const app = express();

app.get('/',(req, res) => {
    res.send('Welcome to Vidly App!');
});

app.get('/ping',(req, res) => {
    res.send('pong');
});


app.listen(3000,() => console.log('listening on port 3000'));