const { check, oneOf } = require('express-validator/check');

function checkApplications(applications) {
  return oneOf([
    check(applications.concat('id'), 'Invalid format').isUUID(),
    check(applications.concat('eventId'), 'Invalid format').isUUID(),
    check(applications.concat('name'), 'Invalid').exists(),
    check(applications.concat('dateOfBirth'), 'Invalid').exists(),
    check(applications.concat('status'), 'Invalid').exists(),
    check(applications.concat('userId'), 'Invalid format').isUUID(),
    check(applications.concat('ticketName'), 'Invalid').exists(),
    check(applications.concat('ticketType'), 'Invalid').exists(),
    check(applications.concat('sessionId'), 'Invalid format').isUUID(),
    check(applications.concat('dojoId'), 'Invalid format').isUUID(),
    check(applications.concat('ticketId'), 'Invalid format').isUUID(),
  ]);
}

module.exports.checkApplications = checkApplications;
