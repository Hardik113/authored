const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const config = require('./config');
const mailObject = require('./mail-object');
const sg = require('sendgrid')(config.SENDGRID_API);

const mailers = {};

function getMailer(req) {
  if (!req.mailer) {
    return Promise.reject({ status: 400, message: 'Invalid Mailers' });
  }
  if (mailers[req.mailer]) {
    return Promise.resolve({ mailer: mailers[req.mailer] });
  }
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '../mailers/', `${req.mailer}.html`), 'utf8', (err, mailer) => {
      if (err) {
        reject({ status: 400, message: 'Invalid Mailer' });
      }
      mailers[req.mailer] = mailer.toString();
      resolve({ mailer: mailers[req.mailer] });
    });
  });
}

function compilerMailer(req, mailer) {
  return new Promise((resolve, reject) => {
    try {
      const template = Handlebars.compile(mailer);
      const html = template(req.data);
      resolve({ mailer: html });
    } catch (e) {
      reject({ status: 400, message: 'Error in compiling Template' });
    }
  });
}

module.exports = function send(req) {
  return new Promise((resolve, reject) => {
    getMailer(req)
      .then((result) => {
        const mailer = result.mailer;
        return compilerMailer(req, mailer);
      })
      .then((result) => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'test') {
          console.log(req.from, req.to, '------Mailer------', result.mailer);
          return resolve({ message: 'Message Sent' });
        }
        const mail = mailObject(req, result);
        // const fromEmail = new helper.Email(req.from);
        // const toEmail = new helper.Email(req.to);
        // const content = new helper.Content('text/html', result.mailer); // Changing the = of link
        // const mail = new helper.Mail(fromEmail, req.subject, toEmail, content);
        const request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail,
        });
        sg.API(request, (error) => {
          if (error) {
            console.log(error);
            reject({ status: 400, data: { message: 'Not Working' } });
          } else {
            resolve({ status: 200, data: { message: 'Message Sent' } });
          }
        });
      })
      .catch((error) => {
        console.log(error);
        reject({ status: 400, data: { message: error.message } });
      });
  });
};
