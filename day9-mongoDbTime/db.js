const { MongoClient} = require("mongodb");

const uri  = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri);

let db;
const  connectDB = async () =>  { 
    if(db){
        return db;
    }

    await client.connect()
    db = client.db("day9db");
    console.log("MongoDB created and connected")
    return db;
}

module.exports = connectDB;