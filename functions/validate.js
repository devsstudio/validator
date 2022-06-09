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
                    _getMessage("notNull", attribute, options.msg)
                  );
                }
                break;
              case "isEmail":
                if (has_value && !validator.isEmail(value)) {
                  throw new DevsStudioValidationError(
                    400,
                    _getMessage("isEmail", attribute, options.msg)
                  );
                }
                break;
              case "isURL":
                if (has_value && !validator.isURL(value)) {
                  throw new DevsStudioValidationError(
                    400,
                    _getMessage("isURL", attribute, options.msg)
                  );
                }
                break;
              case "is":
                if (has_value && !options.args.test(value)) {
                  throw new DevsStudioValidationError(
                    400,
                    _getMessage("is", attribute, options.msg)
                  );
                }
                break;
              case "isIn":
                if (has_value && !validator.isIn(value, options.args)) {
                  throw new DevsStudioValidationError(
                    400,
                    _getMessage("isIn", attribute, options.msg)
                  );
                }
                break;
              case "notIn":
                if (has_value && validator.isIn(value, options.args)) {
                  throw new DevsStudioValidationError(
                    400,
                    _getMessage("notIn", attribute, options.msg)
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
                    _getMessage("len", attribute, options.msg)
                  );
                }
                break;
              case "is":
                if (has_value && !options.args.test(value)) {
                  throw new DevsStudioValidationError(
                    400,
                    _getMessage("is", attribute, options.msg)
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

const _getMessage = (rule, attribute, msg) => {
  switch (rule) {
    case "notNull":
      return msg ? msg : attribute + " es requerido";
    case "isEmail":
      return msg ? msg : attribute + " no es un correo válido";
    case "isURL":
      return msg ? msg : attribute + " no es una URL válida";
    case "len":
      return msg ? msg : attribute + " no cumple con la longitud permitida";
    case "is":
      return msg ? msg : attribute + " no cumple con el formato permitido";
    case "isIn":
      return msg ? msg : attribute + " no está entre los valores permitidos";
    case "notIn":
      return msg ? msg : attribute + " está entre los valores prohibidos";
    default:
      return "Hay errores en " + attribute;
  }
};
