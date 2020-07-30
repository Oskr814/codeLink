require('./config/config');

const express = require('express');
const database = require('./config/database');

const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use(require('./routes/index-route'));

app.listen(process.env.PORT, () => {
    console.log('Servidor inicado en el puerto 3000');
});