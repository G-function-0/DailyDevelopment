const {MongoClient} = require("mongodb");

const URI = "mongodb://127.0.0.1:27017";
const client =new MongoClient(URI);

let db ;

async function connectDB () {
    
    if(db) return db 
    await client.connect();
    db = client.db("day12");
    console.log("Mongo DB connection established");
    return db;

}

module.exports = connectDB;
