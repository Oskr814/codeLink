const express = require('express');

const app = express();

app.use(require('./auth-route'));
app.use(require('./users-route'));
app.use(require('./folders-route'));
app.use(require('./projects-route'));
app.use(require('./snippets-route'));
app.use(require('./uploads-route'));
app.use(require('./images-route'));

module.exports = app;