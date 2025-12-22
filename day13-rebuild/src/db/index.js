const {MongoClient} = require("mongodb");


const client =new MongoClient(process.env.MONGODB_URI);

let db ;

async function connectDB () {
    
    if(db) return db 
    await client.connect();
    db = client.db("day12");
    console.log("Mongo DB connection established");
    return db;

}

module.exports = connectDB;
