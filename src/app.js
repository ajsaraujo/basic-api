<<<<<<< HEAD
require('dotenv').config({ path: '.env' }); 
=======
<<<<<<< Updated upstream
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
}); 
=======
>>>>>>> Stashed changes
>>>>>>> dev

const bodyParser = require('body-parser'); 
const slowDown = require('express-slow-down'); 
const express = require('express');

const routes = require('./routes');
<<<<<<< HEAD
require('./database/database');
=======
<<<<<<< Updated upstream
require('./database'); 
=======

require('dotenv').config(); 
require('./database/database');
>>>>>>> Stashed changes
>>>>>>> dev

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
