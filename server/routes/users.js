const express = require('express');
const UserController = require('../controllers/users');
const Auth = require('../modules/auth');

const router = express.Router();

// router.get('/list', (req, res) => {
//   Auth.authorize(req.session)
//     .then(() => {
//       return UserController.listUsers(req.query);
//     })
//     .then((result) => {
//       res.status(result.status || 200).send(result.data);
//     })
//     .catch((error) => {
//       res.status(error.status).send(error.data);
//     });
// });

router.get('/me', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return UserController.me(req);
    })
    .then((result) => {
      res.status(200 || result.status).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});

router.get('/me_expanded', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return UserController.me_expanded(req);
    })
    .then((result) => {
      res.status(200 || result.status).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});

router.post('/add_favourite', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return UserController.addFavourite(req);
    })
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.message);
    });
});

router.get('/:user_id', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return UserController.getUser(req);
    })
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.message);
    });
});

router.post('/login', (req, res) => {
  UserController.login(req)
    .then((result) => {
      res.status(result.status || 200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});


router.post('/register', (req, res) => {
  UserController.register(req)
    .then((result) => {
      res.status(result.status || 200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});


router.post('/forget-password', (req, res) => {
  UserController.forgetPassword(req)
    .then((result) => {
      res.status(result.status || 200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});


router.post('/reset-password', (req, res) => {
  UserController.resetPassword(req.body)
    .then((result) => {
      res.status(result.status || 200).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});


router.put('/profile', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return UserController.updateProfile(req);
    })
    .then((result) => {
      res.status(200 || result.status).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});


router.post('/profile-image', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return UserController.updateProfileImage(req);
    })
    .then((result) => {
      res.status(200 || result.status).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});


router.post('/makeProfile', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return UserController.makeProfile(req);
    })
    .then((result) => {
      res.status(200 || result.status).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});

router.delete('/:user_id', (req, res) => {
  Auth.authorize(req.session)
    .then(() => {
      return UserController.remove(req);
    })
    .then((result) => {
      res.status(200 || result.status).send(result.data);
    })
    .catch((error) => {
      res.status(error.status).send(error.data);
    });
});
module.exports = router;
