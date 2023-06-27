const dotenv = require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    SECRET_KEY: process.env.SECRET_KEY,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_ACCESS_KEY_SECRET: process.env.AWS_ACCESS_KEY_SECRET
}