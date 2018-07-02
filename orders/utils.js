module.exports = class {
  static quantityByTicket(applications) {
    return applications.reduce((acc, appl) => {
      acc[appl.ticketId] = acc[appl.ticketId] ? acc[appl.ticketId] : 0;
      acc[appl.ticketId] += 1;
      return acc;
    }, {});
  }
};
