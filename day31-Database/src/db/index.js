import mongoose from "mongoose";
import config from "../config/index.js";


export const connectDB = async () => {
    await mongoose.connect(config.mongoUri+`/${config.dbName}`)
    console.log(`MongoDB connection established`);
}