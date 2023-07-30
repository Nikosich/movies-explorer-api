module.exports = class reqError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
};
