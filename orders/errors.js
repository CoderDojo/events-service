class InvalidTicket extends Error {
  constructor() {
    super();
    this.message = 'Invalid ticket sent';
    this.status = 400;
  }
}

module.exports = {
  invalidTicket: new InvalidTicket(),
};
