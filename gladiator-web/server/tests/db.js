const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongodb; // Declare mongodb variable outside of async function

module.exports.connect = async () => {
    if (!mongodb) {
        mongodb = await MongoMemoryServer.create();
    }
    const uri = mongodb.getUri();
    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    await mongoose.connect(uri, mongooseOpts);
}

module.exports.closeDatabase = async () => {
    if (!mongodb) {
        mongodb = await MongoMemoryServer.create();
    }
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongodb.stop();
}

module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for(const key in collections){
        const collection = collections[key];
        await collection.deleteMany();
    }
}