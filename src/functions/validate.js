const validator = require("validator");
const { DevsStudioValidationError } = require("../classes/error");

exports.validate = async (body, config) => {
  try {
    if (config?.attributes) {
      for (var [attribute, validations] of Object.entries(config.attributes)) {
        var has_value =
          typeof body[attribute] !== "undefined" && body[attribute] !== null;

        //El validador solo valida string así que convertimos a string
        var value = body[attribute] + "";
        for (var [rule, options] of Object.entries(validations)) {
          //Detectamos si es una función
          if (typeof options === "function") {
            //Detectamos si es una función asyncrona
            if (options.constructor.name === "AsyncFunction") {
              await options(value);
            } else {
              options(value);
            }
          } else {
            switch (rule) {
              case "notNull":
                if (!has_value) {
                  throw new DevsStudioValidationError(
                    400,
                    _getMessage(
                      "notNull",
                      attribute,
                      options.msg,
                      options.locale
                    )
                  );
                }
                break;
              case "isEmail":
                if (has_value && !validator.isEmail(value)) {
                  throw new DevsStudioValidationError(
                    400,
                    _getMessage(
                      "isEmail",
                      attribute,
                      options.msg,
                      options.locale
                    )
                  );
                }
                break;
              case "isURL":
                if (has_value && !validator.isURL(value)) {
                  throw new DevsStudioValidationError(
                    400,
                    _getMessage("isURL", attribute, options.msg, options.locale)
                  );
                }
                break;
              case "is":
                if (has_value && !options.args.test(value)) {
                  throw new DevsStudioValidationError(
                    400,
                    _getMessage("is", attribute, options.msg, options.locale)
                  );
                }
                break;
              case "isIn":
                if (has_value && !validator.isIn(value, options.args)) {
                  throw new DevsStudioValidationError(
                    400,
                    _getMessage("isIn", attribute, options.msg, options.locale)
                  );
                }
                break;
              case "notIn":
                if (has_value && validator.isIn(value, options.args)) {
                  throw new DevsStudioValidationError(
                    400,
                    _getMessage("notIn", attribute, options.msg, options.locale)
                  );
                }
                break;
              case "len":
                if (
                  has_value &&
                  !validator.isLength(value, {
                    min: options.args[0],
                    max: options.args[1],
                  })
                ) {
                  throw new DevsStudioValidationError(
                    400,
                    _getMessage("len", attribute, options.msg, options.locale)
                  );
                }
                break;
              case "is":
                if (has_value && !options.args.test(value)) {
                  throw new DevsStudioValidationError(
                    400,
                    _getMessage("is", attribute, options.msg, options.locale)
                  );
                }
                break;
            }
          }
        }
      }
    }
    //
    if (config?.model) {
      for (var [functionName, func] of Object.entries(config.model)) {
        //Detectamos si es una función asyncrona
        if (func.constructor.name === "AsyncFunction") {
          await func(body);
        } else {
          func(body);
        }
      }
    }
  } catch (e) {
    throw e;
  }
};

exports.getMessage = (rule, attribute, locale) => {
  return _getMessage(rule, attribute, null, locale);
};

const _getMessage = (rule, attribute, msg, locale) => {
  if (!locale) {
    locale = "es";
  }

  var xGetMessage = null;
  switch (locale) {
    case "en":
      const { getMessage: getMessageEn } = require("../lang/en");
      xGetMessage = getMessageEn;
      break;
    case "es":
    default:
      const { getMessage: getMessageEs } = require("../lang/es");
      xGetMessage = getMessageEs;
      break;
  }

  switch (rule) {
    case "notNull":
    case "isEmail":
    case "isURL":
    case "len":
    case "is":
    case "isIn":
    case "notIn":
      return msg ? msg : xGetMessage(rule, attribute);
    default:
      return xGetMessage(rule, attribute);
  }
};
