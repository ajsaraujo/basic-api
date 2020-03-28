const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const indexRoute = require('./routes/index');
const userRoute = require('./routes/user');

app.use('/', indexRoute);
app.use('/user', userRoute);

app.listen(3000);
console.log('A API está escutando na porta 3000.');

module.exports = app;
