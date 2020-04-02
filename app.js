require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
}); 

const bodyParser = require('body-parser');

const mongoose = require('mongoose'); 
const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true }; 
const connectionString = process.env.DB_HOST + '/' + process.env.DB_NAME; 

console.log(connectionString);
mongoose.connect(connectionString, mongooseOptions);

mongoose.connection.once('open', _ => {
    console.log('Aplicação conectada ao banco de dados.'); 
});

mongoose.connection.on('error', err => {
    console.log(`ERRO: Conexão com o banco de dados falhou.`);
    console.log(err); 
});

const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const indexRoute = require('./routes/index');
const userRoute = require('./routes/user');

app.use('/', indexRoute);
app.use('/user', userRoute);

app.listen(process.env.PORT);
console.log(`A API está escutando na porta ${process.env.PORT}.`);

module.exports = app;
