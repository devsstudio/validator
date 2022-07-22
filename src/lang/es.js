exports.getMessage = (rule, attribute) => {
  switch (rule) {
    case "notNull":
      return attribute + " es requerido";
    case "isEmail":
      return attribute + " no es un correo válido";
    case "isURL":
      return attribute + " no es una URL válida";
    case "len":
      return attribute + " no cumple con la longitud permitida";
    case "is":
      return attribute + " no cumple con el formato permitido";
    case "isIn":
      return attribute + " no está entre los valores permitidos";
    case "notIn":
      return attribute + " está entre los valores prohibidos";
    default:
      return "Hay errores en " + attribute;
  }
};
