require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
}); 

require('./database'); 

const bodyParser = require('body-parser'); 

// Express
const express = require('express');
const app = express();

// SlowDown
const slowDown = require('express-slow-down'); 

const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // A cada 15 minutos 
    delayAfter: 45, // Permite 45 requests 
    delayMs: 100 // Depois disso, atrase 100ms incrementalmente
}); 

app.enable('trust proxy'); 
app.use(speedLimiter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const routes = require('./routes');

app.use('/api', routes);

app.listen(process.env.PORT);
console.log(`A API está escutando na porta ${process.env.PORT}.`);

module.exports = app;
