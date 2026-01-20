
const { default: mongoose } = require("mongoose");
const config = require("../config/index")


exports.connectDB = async () => {
    await mongoose.connect(config.mongoUri)
    console.log(`MongoDB connection established`);
}