const app = require('./app');

app.listen(process.env.PORT);

console.log(`API is listening on PORT ${process.env.PORT}`);