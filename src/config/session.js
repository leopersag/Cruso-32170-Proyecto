const MongoStore = require ('connect-mongo');
const session = require ('express-session');

const vars = require ('./config');
const { SECRET, MONGO_URL, COOKIE_TIME } = vars;

const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true};

module.exports = session ({
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        mongoOptions: advancedOptions,
        ttl: 60,
    }),
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: COOKIE_TIME },
});