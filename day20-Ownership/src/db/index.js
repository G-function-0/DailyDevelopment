const { MongoClient } = require("mongodb")
const config = require("../config/index")

const client = new MongoClient(config.mongoUri);

let db ;

exports.connectDB = async () => {
    
    if(db) return db;

    await client.connect();
    db = client.db(config.dbName);
    console.log(`MongoDB connection established`);
    return db;
}