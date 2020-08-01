const express = require('express');

const app = express();

app.use(require('./login-route'));
app.use(require('./users-route'));
app.use(require('./folders-route'));
app.use(require('./projects-route'));

module.exports = app;