require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
}); 

const mongoose = require('mongoose'); 

const connectionString = process.env.DB_HOST + '/' + process.env.DB_NAME; 

const mongooseOptions = { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false 
}; 

console.log(connectionString);
const connection = mongoose.connect(connectionString, mongooseOptions);
mongoose.set('useCreateIndex', true); 

mongoose.connection.once('open', _ => {
    console.log('Aplicação conectada ao banco de dados.'); 
});

mongoose.connection.on('error', err => {
    console.log(`ERRO: Conexão com o banco de dados falhou.`);
    console.log(err); 
});

module.exports = connection;