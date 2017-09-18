const multer = require('multer');

module.exports = function () {
  return (req, res, next) => {
    const upload = multer().single('image');
    upload(req, res, (err) => {
      if (err) {
        return res.status(500).send({ message: 'Invalid form data type.' });
      }
      next();
    });
  };
};
