require('dotenv').config();

const vars = {
    SECRET: process.env.SECRET || 'nada',
    MONGO_URL: process.env.MONGO_URL,
    COOKIE_TIME: parseInt(process.env.COOKIE_TIME) || 10000,
    TWILIO_ACCOUNTSID: process.env.TWILIO_ACCOUNTSID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_FROM: process.env.TWILIO_FROM,
    TWILIO_TO: process.env.TWILIO_TO,
};

module.exports = vars;