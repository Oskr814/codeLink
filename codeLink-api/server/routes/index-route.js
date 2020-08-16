const express = require('express');

const app = express();

app.use(require('./auth-route'));
app.use(require('./users-route'));
app.use(require('./folders-route'));
app.use(require('./projects-route'));

module.exports = app;