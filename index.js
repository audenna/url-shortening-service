const express = require('express');
// Import the default configurations
const { APP } = require('./src/config/default');

const port = APP.port;
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`App listening at ${port}`);
});
