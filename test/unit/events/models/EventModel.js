const proxy = require('proxyquire');

const EventModel = proxy('../../../../events/models/EventModel', {
  objection: {
    Model: class {
      // eslint-disable-next-line class-methods-use-this
      $beforeInsert() {}
    },
  },
});
describe('EventModel', () => {
  describe('types', () => {
    it('should return an object with 2 values', () => {
      expect(Object.entries(EventModel.types)).eql([
        ['ONE_OFF', 'one-off'],
        ['RECURRING', 'recurring'],
      ]);
    });
  });
  describe('recurringTypes', () => {
    it('should return an object with 2 values', () => {
      expect(Object.entries(EventModel.recurringTypes)).eql([
        ['BIWEEKLY', 'biweekly'],
        ['WEEKLY', 'weekly'],
      ]);
    });
  });
  describe('statuses', () => {
    it('should return an object with 3 values', () => {
      expect(Object.entries(EventModel.statuses)).eql([
        ['DRAFT', 'saved'],
        ['PUBLISHED', 'published'],
        ['CANCELLED', 'cancelled'],
      ]);
    });
  });
  describe('isEditable', () => {
    it('should return true on draft', () => {
      expect(EventModel.isEditable('saved')).to.be.true;
    });
    it('should return true on published', () => {
      expect(EventModel.isEditable('published')).to.be.true;
    });
    it('should return false on cancelled', () => {
      expect(EventModel.isEditable('cancelled')).to.be.false;
    });
    it('should return false on undefined', () => {
      expect(EventModel.isEditable(undefined)).to.be.false;
    });
  });
  describe('$beforeInsert', () => {
    it('should set sensible defaults', async () => {
      const model = new EventModel();
      await model.$beforeInsert();
      expect(model.id).to.exist;
      expect(model.createdAt).to.exist;
    });
  });
});
