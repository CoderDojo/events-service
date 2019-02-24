class OrderNotFound extends Error {
  constructor() {
    super();
    this.message = 'Invalid order';
    this.status = 404;
  }
}

class InvalidTicket extends Error {
  constructor() {
    super();
    this.message = 'Invalid ticket sent';
    this.status = 400;
  }
}

module.exports = {
  orderNotFound: new OrderNotFound(),
  invalidTicket: new InvalidTicket(),
};
