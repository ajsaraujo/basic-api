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
    console.log('App connected with mongo.'); 
});

mongoose.connection.on('error', err => {
    console.log('Error connecting with mongo.');
    console.log(err); 
});

module.exports = connection;