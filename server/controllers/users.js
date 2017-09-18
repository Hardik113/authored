const Promise = require('bluebird');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

const config = require('../modules/config');
const mailer = require('../modules/mailer');
const utils = require('../modules/utils');
const fileHandler = require('../modules/file-handler');

const services = {};

function getUser(query) {
  return new Promise((resolve, reject) => {
    User.find(query, (err, result) => {
      if (err) {
        return reject({ status: 422, data: { message: err.message } });
      }
      resolve(result);
    });
  });
}

function findUser(_id) {
  return new Promise((resolve, reject) => {
    User.findById(_id, (err, user) => {
      if (err) {
        reject({ status: 400, message: err.message });
        return false;
      }
      resolve(user);
    });
  });
}

function verifyPassword(password, hash) {
  return new Promise((resolve, reject) => {
    if (bcrypt.compareSync(password, hash)) {
      return resolve();
    }
    reject({ status: 404, data: { massage: 'Credentials provided are not correct' } });
  });
}

function verifyEmail(email) {
  return new Promise((resolve, reject) => {
    if (utils.validateEmail(email)) {
      return resolve();
    }
    return reject({ status: 400, data: { message: 'Not a valid email' } });
  });
}

function getEmailInfo(user) {
  const emailInfo = {
    from: 'support@authored.com',
    to: [{
      email: user.email,
    }],
    mailer: 'welcome_email',
    subject: 'Welcome to Authored!!',
    data: {
      name: user.name,
      link: `${config.ui.host}onboarding?token=${jwt.sign({ _id: user._id, type: '' }, config.secret, { expiresIn: '1d' })}`,
    },
  };
  return emailInfo;
}

function addUser(data) {
  return new Promise((resolve, reject) => {
    const user = new User({
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      password: bcrypt.hashSync(data.password, 10),
    });
    user.save((err, res) => {
      if (err) {
        reject({ status: 422, message: err.message });
        return false;
      }
      resolve(res);
    });
  });
}

function login(req) {
  return new Promise((resolve, reject) => {
    if (req.body.user_name && !req.body.password) {
      return reject({ status: 400, data: { message: 'Invalid Request' } });
    }
    if (req.body.email && !req.body.password) {
      return reject({ status: 400, data: { message: 'Invalid Request' } });
    }
    const query = {};
    let user = null;
    if (utils.validateEmail(req.body.user_name)) {
      query.email = req.body.user_name;
    } else {
      query.user_name = req.body.user_name;
    }
    getUser(query)
      .then((result) => {
        if (!result.length) {
          return reject({ status: 404, data: { message: 'user not found' } });
        }
        user = result[0];
        if (user.status !== 'active') {
          return reject({ status: 404, data: { message: 'user not found(status)' } });
        }
        return verifyPassword(req.body.password, user.password);
      })
      .then(() => {
        if (user.profile_image && !utils.isAbsoluteURL(user.profile_image)) {
          user.profile_image = `${config.cdn}${user.profile_image}`;
        }
        resolve({
          status: 200,
          data: {
            token: jwt.sign({ user_id: user._id, type: 'login' }, config.secret),
            first_name: user.first_name,
            last_name: user.last_name,
            profile_image: user.profile_image,
            type: user.type,
          },
        });
      })
      .catch((error) => {
        reject({ status: error.status, data: { message: error.message } });
      });
  });
}

function register(req) {
  return new Promise((resolve, reject) => {
    if (!req.body.email || !req.body.first_name || !req.body.last_name || !req.body.password) {
      return reject({ status: 400, data: { message: 'Invalid Request' } });
    }
    const query = {};
    query.email = req.body.email;
    getUser(query)
      .then((result) => {
        if (result.length) {
          return Promise.reject({ status: 409, message: 'user already exists' });
        }
        return verifyEmail(req.body.email);
      })
      .then(() => {
        return addUser(req.body);
      })
      .then((user) => {
        const emailInfo = getEmailInfo(user);
        mailer(emailInfo)
          .then((ret) => {
            resolve({ status: 200, data: { _id: user._id, message: ret.message } });
          })
          .catch((error) => {
            reject({ status: 400, data: { message: error.message } });
          });
      })
      .catch((error) => {
        reject({ status: error.status, data: { message: error.message } });
      });
  });
}

function updateProfile(req) {
  return new Promise((resolve, reject) => {
    findUser(req.session.user._id)
      .then((user) => {
        const packet = Packet.makeUserPacket(req.body);
        User.findByIdAndUpdate(user._id, packet, { new: true }, (err) => {
          if (err) {
            reject({ status: 422, data: { message: err.message } });
            return false;
          }
          resolve({ status: 200, data: { message: 'member updated' } });
        });
      })
      .catch((error) => {
        reject({ status: error.status, data: { message: error.message } });
        return false;
      });
  });
}

function updateProfileImage(req) {
  return new Promise((resolve, reject) => {
    if (!req.file) {
      return reject({ status: 400, data: { message: 'Image not found' } });
    }
    const key = `profile/${req.session.user._id}/${fileHandler.getAWSKey(req.file.originalname)}`;
    fileHandler.uploadToS3(key, req.file)
      .then(() => {
        User.findByIdAndUpdate(req.session.user._id, { profile_image: key }, (err) => {
          if (err) {
            reject({ status: 422, data: { message: err.message } });
            return false;
          }
          resolve({ status: 200, data: { url: `${config.cdn}${key}` } });
        });
      })
      .catch(() => {
        reject({ status: 400, data: { message: 'Error in uploading file to S3' } });
      });
  });
}

function me(req) {
  return new Promise((resolve) => {
    const user = req.session.user;
    if (user.profile_image && !utils.isAbsoluteURL(user.profile_image)) {
      user.profile_image = `${config.cdn}${user.profile_image}`;
    }
    resolve({ status: 200, data: user });
  });
}

function listUsers(query) {
  return new Promise((resolve, reject) => {
    const allowedType = ['member', 'helper'];
    const allowedStatus = ['in_interview', 'in_verification', 'active', 'new', 'rejected'];
    let total;

    if ((query.start) && (isNaN(query.start) || (parseInt(query.start, 10) < 0))) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }
    if ((query.limit) && (isNaN(query.limit) || (parseInt(query.limit, 10) < 0))) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }
    if ((query.type) && (!(allowedType.indexOf(query.type) > -1))) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }
    if ((query.status) && (!(allowedStatus.indexOf(query.status) > -1))) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }

    const start = (parseInt(query.start, 10)) ? parseInt(query.start, 10) : 0;
    const limit = (parseInt(query.limit, 10)) ? parseInt(query.limit, 10) : 25;
    const type = query.type ? [query.type] : allowedType;
    const status = query.status ? [query.status] : allowedStatus;

    // Is required because when the front gives no type or status have to return all records
    User.count({ type: { $in: type }, status: { $in: status } }, (err, c) => {
      if (err) {
        reject({ status: 422, data: { message: err.message } });
        return false;
      }
      total = c;
    });

    User.find({
      type: { $in: type },
      status: { $in: status },
    })
      .skip(start)
      .limit(limit)
      .exec((err, resArr) => {
        if (err) {
          reject({ status: 422, data: { message: err.message } });
          return false;
        }
        resolve({ status: 200, data: { totalCount: total, count: resArr.length, result: resArr } });
      });
  });
}

services.login = login;
services.register = register;
services.updateProfile = updateProfile;
services.updateProfileImage = updateProfileImage;
services.me = me;
services.listUsers = listUsers;

module.exports = services;
