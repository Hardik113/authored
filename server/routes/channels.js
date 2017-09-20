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
      res.status(error.status).send(error.message);
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
      res.status(error.status).send(error.message);
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
      res.status(error.status).send(error.message);
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
      res.status(error.status).send(error.message);
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
      res.status(error.status).send(error.message);
    });
});

router.post('/addLike/:channel_id', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return ChannelController.addLike(req);
    })
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.message);
    });
});

module.exports = router;
