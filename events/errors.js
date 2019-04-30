class InvalidStatus extends Error {
  constructor() {
    super();
    this.status = 400;
    this.message = 'Invalid status';
  }
}
class StatusNotHandled extends Error {
  constructor() {
    super();
    this.status = 400;
    this.message = 'Recurring events are not implemented (yet)';
  }
}

module.exports = {
  InvalidStatus: new InvalidStatus(),
  StatusNotHandled: new StatusNotHandled(),
};
