const config = require("../config/index");
const {MongoClient} = require("mongodb");

const client = new MongoClient(config.mongouri);

let db ;

async function connectDB() {
    if(db) return db;
    await client.connect()
    db =client.db(config.dbname);
    console.log(`MongoDB connected`);
    return db;
}

module.exports = connectDB;