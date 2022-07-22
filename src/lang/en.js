exports.getMessage = (rule, attribute) => {
  switch (rule) {
    case "notNull":
      return attribute + " is required";
    case "isEmail":
      return attribute + " is not a valid email";
    case "isURL":
      return attribute + " is not a valid URL";
    case "len":
      return attribute + " does not have the allowed length";
    case "is":
      return attribute + " does not have the allowed format";
    case "isIn":
      return attribute + " is not among the allowed values";
    case "notIn":
      return attribute + " is among the prohibited values";
    default:
      return "There are errors in " + attribute;
  }
};
