const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./modules/db');
const fileParser = require('./modules/file-parser');
const sessions = require('./modules/sessions');

// const index = require('./routes/index');
const users = require('./routes/users');
const books = require('./routes/books');
const channels = require('./routes/channels');

const app = express();
db();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

app.use(sessions());
app.use(fileParser());

app.use('/users', users);
app.use('/books', books);
app.use('/channels', channels);


// catch 404 and forward to error handler
/* eslint-disable */
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});
/* eslint-enable */

module.exports = app;
