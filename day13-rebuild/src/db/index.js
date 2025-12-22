const {MongoClient} = require("mongodb");

const config = require("../config/index")
const client =new MongoClient(config.mongouri);

let db ;

async function connectDB () {
    
    if(db) return db 
    await client.connect();
    db = client.db("day12");
    console.log("Mongo DB connection established");
    return db;

}

module.exports = connectDB;
