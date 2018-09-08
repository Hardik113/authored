const express = require('express');

const BookController = require('../controllers/books');
const Auth = require('../modules/auth');

const router = express.Router();

router.get('/list', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return BookController.list(req.query);
    })
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});

router.get('/:book_id', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return BookController.getBook(req);
    })
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});

router.post('/create', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return BookController.addBook(req);
    })
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});

router.put('/:book_id', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return BookController.updateBook(req);
    })
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});

router.delete('/:book_id', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return BookController.deleteBook(req);
    })
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});

router.post('/addLike/:book_id', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return BookController.addLike(req);
    })
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});

module.exports = router;
