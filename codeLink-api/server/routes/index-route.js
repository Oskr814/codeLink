const express = require('express');

const app = express();

app.use(require('./users-route'));

module.exports = app;