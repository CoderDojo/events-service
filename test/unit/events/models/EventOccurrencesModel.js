const proxy = require('proxyquire');

const EventModel = proxy('../../../../events/models/EventOccurrencesModel', {
  objection: { Model: class { } },
});
describe('EventModel', () => {
  describe('tickets', () => {
    it('should return an array of tickets from the sessions', () => {
      const am = new EventModel();
      am.sessions = [{
        tickets: [
          { id: 'ticket1' },
          { id: 'ticket2' },
        ],
      }, {
        tickets: [
          { id: 'ticket3' },
          { id: 'ticket4' },
        ],
      },
      ];
      const tickets = am.tickets;
      expect(tickets).to.eql([
        { id: 'ticket1' },
        { id: 'ticket2' },
        { id: 'ticket3' },
        { id: 'ticket4' },
      ]);
    });
  });
});
