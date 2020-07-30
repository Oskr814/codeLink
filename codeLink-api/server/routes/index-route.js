const express = require('express');

const app = express();

app.use(require('./users-route'));
app.use(require('./login-route'));

module.exports = app;