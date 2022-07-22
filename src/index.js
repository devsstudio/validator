const { validate, getMessage } = require("./functions/validate");

exports.validate = async function (body, config) {
  return await validate(body, config);
};

exports.getMessage = (rule, attribute, locale) => {
  return getMessage(rule, attribute, null, locale);
};
