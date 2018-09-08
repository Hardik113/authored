const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

const config = require('./config');
const cache = require('./cache');
const User = require('../models/users');

function getUser(id) {
  return new Promise((resolve, reject) => {
    let user = null;
    cache.getValue(`USER_${id}`)
      .then((value) => {
        if (value) {
          return resolve(JSON.parse(value));
        }
        User.findById(id, (err, result) => {
          if (err) {
            return reject({ status: 422, message: err.message });
          }
          if (!result) {
            return reject({ status: 404, message: 'User Not found' });
          }
          user = result;
          cache.setValue(`USER_${id}`, JSON.stringify(result));
          return resolve(user);
        });
      });
  });
}

module.exports = () => {
  return (req, res, next) => {
    req.session = {
      user: {
        type: 'guest',
      },
      is_logged_in: false,
    };
    req.hf = {
      is_logged_in: false,
    };
    if (!req.headers.authorization) {
      return next();
    }
    jwt.verify(req.headers.authorization, config.secret, (err, payload) => {
      if (err) {
        res.status(498).send({ message: 'Invalid Token' });
        return false;
      }
      if (payload.type !== 'login') {
        return next();
      }
      getUser(payload.user_id)
        .then((user) => {
          req.session.user = user;
          req.session.is_logged_in = true;
          return next();
        })
        .catch((error) => {
          console.log(error);
          res.status(error.status).send({ data: { message: error.message } });
        });
    });
  };
};
