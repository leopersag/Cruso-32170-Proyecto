require('dotenv').config();

const vars = {
    SECRET: process.env.SECRET || 'nada',
    MONGO_URL: process.env.MONGO_URL,
    COOKIE_TIME: parseInt(process.env.COOKIE_TIME) || 10000,
};

module.exports = vars;