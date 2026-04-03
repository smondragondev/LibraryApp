const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    url: process.env.MONGODB_URL,
};