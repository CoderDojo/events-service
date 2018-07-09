const proxy = require('proxyquire');

const OrderModel = proxy('../../../../orders/models/OrderModel', {
  objection: { Model: class { } },
});
describe('OrderModel', () => {
  describe('beforeInsert', () => {
    it('should set the order created_at date', () => {
      const am = new OrderModel();
      am.$beforeInsert();
      expect(am.id).to.not.be.undefined;
      expect(am.createdAt).to.not.be.undefined;
    });
  });
});
