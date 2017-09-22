module.exports = function getMailObject(req, result) {
  const mailObject = {};
  mailObject.personalizations = [];
  mailObject.personalizations.push({
    to: req.to,
    subject: req.subject,
  });
  mailObject.from = {};
  mailObject.from.email = req.from;
  mailObject.content = [];
  mailObject.content.push({
    type: 'text/html',
    value: result.mailer,
  });
  return mailObject;
};
