require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
}); 

const bodyParser = require('body-parser'); 
const slowDown = require('express-slow-down'); 
const express = require('express');

const routes = require('./routes');
require('./database'); 

const app = express();

// Slow down requests
const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // Each 15 minutes 
    delayAfter: 45, // Allow 45 requests
    delayMs: 100 // After that delay responses
}); 
app.enable('trust proxy'); 
app.use(speedLimiter);

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', routes);
app.listen(process.env.PORT);
console.log(`API is listening on port ${process.env.PORT}.`);

module.exports = app;
