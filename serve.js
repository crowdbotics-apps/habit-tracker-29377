// deprecated no longer used
require('dotenv').config();

const express = require('express');
const path = require('path');
const proxy = require('express-http-proxy');

const app = express();
const port = process.env.PORT;
const HAT_AROOTAH_URL = process.env.REACT_APP_HAT_AROOTAH_URL;

app.use(express.static(path.join(__dirname, 'build')));

app.use('/api/v1', proxy(HAT_AROOTAH_URL));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => console.log(`listening on port ${port}`));
