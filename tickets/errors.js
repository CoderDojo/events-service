class NotEnoughCapacityError extends Error {
  constructor() {
    super();
    this.status = 409;
    this.message = 'Not enough capacity';
  }
}
module.exports = {
  notEnoughCapacityError: new NotEnoughCapacityError(),
};
