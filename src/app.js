require('dotenv').config(); 

const bodyParser = require('body-parser'); 
const slowDown = require('express-slow-down'); 
const express = require('express');

require('./database/database');
const routes = require('./routes');

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
    
module.exports = app;
