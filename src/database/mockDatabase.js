const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongo = new MongoMemoryServer();

module.exports.connect = async () => {
    const uri = await mongo.getConnectionString();

    const options = {
        useNewUrlParser: true,
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000
    };

    await mongoose.connect(uri, options);

    mongoose.connection.once('open', 
        () => console.log('App connected to in memory database.'));

    mongoose.connection.on('error', 
        () => console.log('Error connecting to in memory database.'));
}

module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
}

module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = colletions[key];
        await collection.deleteMany();
    }
}