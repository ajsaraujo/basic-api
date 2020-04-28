const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongo = new MongoMemoryServer();

module.exports.connect = async () => {
    const uri = await mongo.getConnectionString();

    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    await mongoose.connect(uri, options);
    mongoose.set('useCreateIndex', true);
    
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
        const collection = collections[key];
        await collection.deleteMany();
    }
}