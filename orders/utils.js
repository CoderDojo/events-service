const { invalidTicket } = require('./errors');

module.exports = {
  // Could be refactored as a constructor for an application, from a ticket model
  formatApplications: (event, applications) => {
    return applications.map((appl) => {
      const ticket = event.tickets.find(t => t.id === appl.ticketId);
      if (ticket) {
        return {
          ...appl,
          ticketName: ticket.name,
          ticketType: ticket.type,
          dojoId: event.dojoId,
          eventId: event.id,
        };
      }
      throw invalidTicket;
    });
  },
  quantityByTicket(applications) {
    return applications.reduce((acc, appl) => {
      acc[appl.ticketId] = acc[appl.ticketId] ? acc[appl.ticketId] : 0;
      acc[appl.ticketId] += 1;
      return acc;
    }, {});
  },
};
