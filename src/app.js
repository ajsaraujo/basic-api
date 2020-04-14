require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
}); 

const bodyParser = require('body-parser'); 

// Mongoose 
const mongoose = require('mongoose'); 
const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true }; 
const connectionString = process.env.DB_HOST + '/' + process.env.DB_NAME; 

console.log(connectionString);
mongoose.connect(connectionString, mongooseOptions);
mongoose.set('useCreateIndex', true); 

mongoose.connection.once('open', _ => {
    console.log('Aplicação conectada ao banco de dados.'); 
});

mongoose.connection.on('error', err => {
    console.log(`ERRO: Conexão com o banco de dados falhou.`);
    console.log(err); 
});

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
