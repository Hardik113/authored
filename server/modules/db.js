const mongoose = require('mongoose');
const config = require('./config');
mongoose.Promise = require('bluebird');

mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open to ');
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose default connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = function connect() {
  mongoose.connect(config.db.host, config.db.options);
};
