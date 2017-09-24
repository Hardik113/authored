const Promise = require('bluebird');

const Channel = require('../models/channels');
const Book = require('../models/books');
const User = require('../models/users');


function find(channelName) {
  return new Promise((resolve, reject) => {
    Channel.find({ name: channelName }, (err, result) => {
      if (err) {
        reject({ status: 422, message: err.message });
        return false;
      }
      resolve(result);
    });
  });
}

function get(channelId) {
  return new Promise((resolve, reject) => {
    Channel.findById(channelId, (err, result) => {
      if (err) {
        reject({ status: 422, message: err.message });
        return false;
      }
      resolve(result);
    });
  });
}

function addChannel(req) {
  return new Promise((resolve, reject) => {
    const channel = new Channel(req.body);
    if (channel.validateSync()) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }
    find(req.body.name)
      .then((result) => {
        if (result.length > 0) {
          reject({ status: 404, data: { message: 'Channel already present' } });
          return false;
        }
        channel.save((err) => {
          if (err) {
            reject({ status: 422, message: err.message });
            return false;
          }
        });
        return User.update({ _id: req.session.user._id }, { $push: { my_channels: channel._id } });
      })
      .then(() => {
        resolve({ status: 200, data: { message: 'Channel Created' } });
      })
      .catch((error) => {
        reject({ status: error.status, data: { message: error.message } });
      });
  });
}

function getChannel(req) {
  return new Promise((resolve, reject) => {
    if (!req.params.channel_id) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }
    get(req.params.channel_id)
      .then((result) => {
        if (!result) {
          reject({ status: 400, data: { message: 'Channel not found' } });
          return false;
        }
        resolve({ status: 200, data: result });
      })
      .catch((error) => {
        reject({ status: error.status, data: { message: error.message } });
      });
  });
}

function updateChannel(req) {
  return new Promise((resolve, reject) => {
    if (!req.params.channel_id) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }
    Channel.update({ _id: req.params.channel_id }, req.body, (err, res) => {
      if (err) {
        reject({ status: 422, data: { message: err.message } });
        return false;
      }
      if (res.n !== 1) {
        reject({ status: 404, data: { message: 'Channel not found' } });
        return false;
      }
      resolve({ status: 200, data: { message: 'Channel Updated' } });
    });
  });
}

function deleteChannel(req) {
  return new Promise((resolve, reject) => {
    if (!req.params.channel_id) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }
    Channel.findByIdAndRemove(req.params.channel_id, (err) => {
      if (err) {
        reject({ status: 422, message: err.message });
        return false;
      }
      return User.update({ _id: req.session.user._id }, { $pull: { my_channels: req.params.channel_id } });
    })
      .then(() => {
        resolve({ status: 200, data: { message: 'Channel Deleted' } });
      })
      .catch((error) => {
        reject({ status: error.status, data: { message: error.message } });
      });
  });
}

function addLike(req) {
  return new Promise((resolve, reject) => {
    if (!req.params.channel_id) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }
    Channel.update({ _id: req.params.channel_id }, { $inc: { likes: 1 } }, (err, res) => {
      if (err) {
        reject({ status: 422, data: { message: err.message } });
        return false;
      }
      if (res.n !== 1) {
        reject({ status: 404, data: { message: 'Channel not found' } });
        return false;
      }
      resolve({ status: 200, data: { message: 'Likes Added' } });
    });
  });
}

function list(query) {
  return new Promise((resolve, reject) => {
    const allowedFilter = ['name', 'rating', 'views', 'likes'];
    if ((query.start) && (isNaN(query.start) || (parseInt(query.start, 10) < 0))) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }
    if ((query.limit) && (isNaN(query.limit) || (parseInt(query.limit, 10) < 0))) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }
    if ((query.type) && (!(allowedFilter.indexOf(query.filter) > -1))) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }

    const start = (parseInt(query.start, 10)) ? parseInt(query.start, 10) : 0;
    const limit = (parseInt(query.limit, 10)) ? parseInt(query.limit, 10) : 25;

    let filter = query.filter;
    if (query.filter === 'views' || query.filter === 'likes') {
      filter = `-${query.filter}`;
    }

    let search = {};
    if (query.search) {
      search = {
        $text: {
          $search: query.search,
        },
      };
    }
    Channel.find(search)
      .sort(filter)
      .skip(start)
      .limit(limit)
      .exec((err, result) => {
        if (err) {
          reject({ status: 422, data: { message: err.message } });
          return false;
        }
        resolve({ status: 200, data: { count: result.length, resArr: result } });
      });
  });
}

function addBook(req) {
  return new Promise((resolve, reject) => {
    if (!req.params.channel_id) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }
    const book = new Book(req.body);
    if (book.validateSync()) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }
    find(req.body.name)
      .then((result) => {
        if (result.length > 0) {
          reject({ status: 404, data: { message: 'Book already present' } });
          return false;
        }
        book.save((err) => {
          if (err) {
            reject({ status: 422, message: err.message });
            return false;
          }
        });
        return updateChannel({ params: req.params, body: { $push: { book_list: book._id } } });
      })
      .then(() => {
        resolve({ status: 200, data: { message: 'Book Created' } });
      })
      .catch((error) => {
        reject({ status: error.status, data: error.data });
      });
  });
}

function deleteBook(req) {
  return new Promise((resolve, reject) => {
    if (!req.params.channel_id || !req.body.book_id) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }
    Book.findByIdAndRemove(req.body.book_id, (err) => {
      if (err) {
        reject({ status: 422, message: err.message });
        return false;
      }
      return updateChannel({ params: req.params, body: { $pull: { book_list: req.body.book_id } } });
    })
      .then(() => {
        resolve({ status: 200, data: { message: 'Book Removed' } });
      })
      .catch((error) => {
        reject({ status: error.status, data: error.data });
      });
  });
}

const services = {};

services.addChannel = addChannel;
services.addLike = addLike;
services.updateChannel = updateChannel;
services.getChannel = getChannel;
services.deleteChannel = deleteChannel;
services.list = list;
services.addBook = addBook;
services.deleteBook = deleteBook;

module.exports = services;
