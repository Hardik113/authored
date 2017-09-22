const config = require('../config/config.json');

const ENV = process.env.NODE_ENV || 'localhost';
module.exports = config[ENV];
