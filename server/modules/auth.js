const Promise = require('bluebird');

function authorize(session) {
  return new Promise((resolve, reject) => {
    if (session.is_logged_in) {
      return resolve();
    }
    reject({ status: 401, data: { message: 'You are not logged In' } });
  });
}

const services = {};

services.authorize = authorize;

module.exports = services;
