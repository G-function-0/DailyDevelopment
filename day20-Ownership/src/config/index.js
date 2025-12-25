module.exports = {
    port : process.env.PORT,
    mongoUri : process.env.MONGO_URI,
    dbName : process.env.DB_NAME,
    jwtSecret : process.env.JWT_SECRET,
    expiresIn : process.env.JWT_EXPIRES_IN,
}