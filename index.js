const { validate } = require("./functions/validate");

exports.validate = async function (body, config) {
  return await validate(body, config);
};
