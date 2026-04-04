const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const createError = require('http-errors')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const {origin} = require('./src/config/core.config');
const mongoDB = require('./src/config/db.config')

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const db = require('./src/models');
const store = new MongoDBStore({
  uri: db.url,
  collection: 'sessions'
});
var corsOptions = {
    origin: origin
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// SESSION
app.use(
    session(
        {
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: store
        }
    )
);


// ROUTES
app.use('/', require('./src/routes'));

db.mongoose
    .connect(db.url)
    .then(() => {
        console.log('Connected to the database!');
    })
    .catch((err) => {
        console.log('Cannot connect to the database!', err);
        process.exit();
    });

mongoDB.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and node running on port ${port}`);
    });
  }
});
// 404 handler 
app.use((req, res, next) => {
    next(createError.NotFound());
})

// ERROR HANDLER

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
    next();
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});