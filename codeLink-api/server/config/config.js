// Puerto

process.env.PORT = process.env.PORT || 3000;

//SEED JWT
process.env.SEED = process.env.SEED || 'JWT-secret';

//JWT EXP
process.env.JWTEXP = 60 * 60 * 24;