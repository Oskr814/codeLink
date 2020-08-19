// Puerto

process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// DB
let urlDB;

if(process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/codeLink'
} else {
    urlDB = 'mongodb+srv://admin:asd.1234@codelink.blc1l.mongodb.net/codeLink?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB;

//SEED JWT
process.env.SEED = process.env.SEED || 'JWT-secret';

//JWT EXP
process.env.JWTEXP = 1000*60*60*24*30;