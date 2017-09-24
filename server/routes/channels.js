const express = require('express');

const ChannelController = require('../controllers/channels');
const Auth = require('../modules/auth');

const router = express.Router();

router.get('/', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return ChannelController.list(req.query);
    })
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});

router.post('/add_like/:channel_id', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return ChannelController.addLike(req);
    })
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});

router.get('/:channel_id', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return ChannelController.getChannel(req);
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
      return ChannelController.addChannel(req);
    })
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});

router.put('/:channel_id', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return ChannelController.updateChannel(req);
    })
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});

router.delete('/:channel_id', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return ChannelController.deleteChannel(req);
    })
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});

router.post('/addBook/:channel_id', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return ChannelController.addBook(req);
    })
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});

router.post('/delBook/:channel_id', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return ChannelController.deleteBook(req);
    })
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});


module.exports = router;
