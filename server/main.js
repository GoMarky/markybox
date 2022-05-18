const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Create a new express app instance
const app = express();

const STATIC = path.resolve(__dirname, '../dist');
const INDEX = path.resolve(STATIC, 'index.html');
const PORT = 3020;

app.use(bodyParser.json());

// Static content
app.use(express.static(STATIC));

// All GET request handled by INDEX file
app.get('*', function (_, res) {
  res.sendFile(INDEX);
});

// Start server
app.listen(PORT, function () {
  console.log('Server up and running on ', `http://localhost:${PORT}/`);
});
