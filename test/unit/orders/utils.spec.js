const { formatApplications } = require('../../../orders/utils');

describe('orders/utils', () => {
  describe('formatApplications', () => {
    const event = {
      id: 'event1',
      tickets: [
        { id: 't1', name: 'ticket1', type: 'mentor' },
        { id: 't2', name: 'ticket2', type: 'mentor' },
        { id: 't3', name: 'ticket3', type: 'mentor' },
      ],
    };
    test('formatApplications should enforce ticketName, ticketType, dojoId and eventId', () => {
      const applications = [{
        name: 'batman',
        dob: '2018-01-01',
        ticketId: 't1',
        ticketName: 'tickettack',
        ticketType: 'superhero',
      }];
      const formatted = formatApplications(event, applications);
      expect(formatted.length).toEqual(1);
      expect(formatted[0].ticketName).toEqual('ticket1');
      expect(formatted[0].ticketType).toEqual('mentor');
      expect(formatted[0].ticketName).toEqual('ticket1');
    });
    test('formatApplications should throw an error', () => {
      const applications = [{
        name: 'batman',
        dob: '2018-01-01',
        ticketId: 'fakeTicket',
        ticketName: 'tickettack',
        ticketType: 'superhero',
      }];
      expect(() => formatApplications(event, applications)).toThrow('Invalid ticket sent');
    });
    test('formatApplications should return an empty array if by any chance, there is no applications', () => {
      const applications = [];
      expect(formatApplications(event, applications)).toEqual([]);
    });
  });
});
