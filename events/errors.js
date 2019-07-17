class InvalidStatus extends Error {
  constructor() {
    super();
    this.status = 400;
    this.message = 'Invalid status';
  }
}
class TypeNotHandled extends Error {
  constructor() {
    super();
    this.status = 501;
    this.message = 'Recurring events are not implemented (yet)';
  }
}

module.exports = {
  InvalidStatus: new InvalidStatus(),
  TypeNotHandled: new TypeNotHandled(),
};
