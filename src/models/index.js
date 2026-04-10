const dbConfig = require('../config/db.config.js');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.authors = require('./authors.js')(mongoose);
db.reservations = require('./reservations.js')(mongoose);

module.exports = db;