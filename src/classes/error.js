class DevsStudioValidationError extends Error {
  httpCode;
  constructor(code, message) {
    super(message);
    this.httpCode = code;
    this.name = "DevsStudioValidationError";
  }
}

exports.DevsStudioValidationError = DevsStudioValidationError;
