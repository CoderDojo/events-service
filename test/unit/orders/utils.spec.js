const { formatApplications, quantityByTicket } = require('../../../orders/utils');

describe('orders/utils', () => {
  describe('formatApplications', () => {
    const event = {
      id: 'event1',
      dojoId: 'dojo1',
      tickets: [
        { id: 't1', name: 'ticket1', type: 'mentor' },
        { id: 't2', name: 'ticket2', type: 'mentor' },
        { id: 't3', name: 'ticket3', type: 'mentor' },
      ],
    };
    it('should enforce ticketName, ticketType, dojoId and eventId', () => {
      const applications = [{
        name: 'batman',
        dob: '2018-01-01',
        ticketId: 't1',
        ticketName: 'tickettack',
        ticketType: 'superhero',
      }];
      const formatted = formatApplications(event, applications);
      expect(formatted.length).to.eql(1);
      expect(formatted[0].ticketName).to.eql('ticket1');
      expect(formatted[0].ticketType).to.eql('mentor');
      expect(formatted[0].dojoId).to.eql('dojo1');
      expect(formatted[0].eventId).to.eql('event1');
    });
    it('should throw an error', () => {
      const applications = [{
        name: 'batman',
        dob: '2018-01-01',
        ticketId: 'fakeTicket',
        ticketName: 'tickettack',
        ticketType: 'superhero',
      }];
      expect(() => formatApplications(event, applications)).to.throw('Invalid ticket sent');
    });
    it('should return an empty array if by any chance, there is no applications', () => {
      const applications = [];
      expect(formatApplications(event, applications)).to.eql([]);
    });
  });
  describe('quantityByTicket', () => {
    it('should return the number of application by ticketId', () => {
      const applications = [{
        name: 'batman',
        dob: '2018-01-01',
        ticketId: 'fakeTicket',
        ticketName: 'tickettack',
        ticketType: 'superhero',
      }, {
        name: 'batman',
        dob: '2018-01-01',
        ticketId: 'fakeTicket',
        ticketName: 'tickettack',
        ticketType: 'superhero',
      }];
      const expected = {
        fakeTicket: 2,
      };
      expect(quantityByTicket(applications)).to.eql(expected);
    });
  });
});
