const Promise = require('bluebird');

const Book = require('../models/books');
const User = require('../models/users');


function find(bookName) {
  return new Promise((resolve, reject) => {
    Book.find({ name: bookName }, (err, result) => {
      if (err) {
        reject({ status: 422, message: err.message });
        return false;
      }
      resolve(result);
    });
  });
}

function get(bookId) {
  return new Promise((resolve, reject) => {
    Book.findById(bookId, (err, result) => {
      if (err) {
        reject({ status: 422, message: err.message });
        return false;
      }
      resolve(result);
    });
  });
}

function addBook(req) {
  return new Promise((resolve, reject) => {
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
        return User.update({ _id: req.session.user._id }, { $push: { my_publishing: book._id } });
      })
      .then(() => {
        resolve({ status: 200, data: { message: 'Book added' } });
      })
      .catch((error) => {
        reject({ status: error.status, data: { message: error.message } });
      });
  });
}

function getBook(req) {
  return new Promise((resolve, reject) => {
    if (!req.params.book_id) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }
    get(req.params.book_id)
      .then((result) => {
        if (!result) {
          reject({ status: 400, data: { message: 'Book not found' } });
          return false;
        }
        resolve({ status: 200, data: result });
      })
      .catch((error) => {
        reject({ status: error.status, data: { message: error.message } });
      });
  });
}

function updateBook(req) {
  return new Promise((resolve, reject) => {
    if (!req.params.book_id) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }
    Book.findByIdAndUpdate(req.params.book_id, req.body, (err) => {
      if (err) {
        reject({ status: 422, message: err.message });
        return false;
      }
      resolve({ status: 200, data: { message: 'Book Updated' } });
    });
  });
}

function deleteBook(req) {
  return new Promise((resolve, reject) => {
    if (!req.params.book_id) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }
    Book.findByIdAndRemove(req.params.book_id, (err) => {
      if (err) {
        reject({ status: 422, message: err.message });
        return false;
      }
      return User.update({ _id: req.session.user._id }, { $pull: { my_publishing: req.params.book_id } });
    })
      .then(() => {
        resolve({ status: 200, data: { message: 'Book Removed' } });
      })
      .catch((error) => {
        reject({ status: error.status, data: { message: error.message } });
      });
  });
}

function addLike(req) {
  return new Promise((resolve, reject) => {
    if (!req.params.book_id) {
      reject({ status: 400, data: { message: 'Invalid Request' } });
      return false;
    }
    Book.findByIdAndUpdate(req.params.book_id, { likes: { $incr: 1 } }, (err) => {
      if (err) {
        reject({ status: 422, data: { message: err.message } });
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
    if (query.filter === 'createdAt') {
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
    Book.find(search)
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

const services = {};

services.addBook = addBook;
services.addLike = addLike;
services.updateBook = updateBook;
services.getBook = getBook;
services.deleteBook = deleteBook;
services.list = list;

module.exports = services;
