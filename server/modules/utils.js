const utils = {};

function validateEmail(email) {
  /*eslint-disable */
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  /*eslint-enable */
  return re.test(email);
}

function isAbsoluteURL(url) {
  /*eslint-disable */
  const re = /(\/?[\w-]+)(\/[\w-]+)*\/?|(((http|ftp|https):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?)/gi
  /*eslint-enable */
  return re.test(url);
}

utils.validateEmail = validateEmail;
utils.isAbsoluteURL = isAbsoluteURL;
module.exports = utils;
