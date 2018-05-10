const { check } = require('express-validator/check');

function checkApplications(applications) {
  return [
    check(`${applications}eventId`, 'Invalid format').isUUID(),
    check(`${applications}name`, 'Invalid').exists(),
    check(`${applications}dateOfBirth`, 'Invalid').exists(),
    check(`${applications}status`, 'Invalid').exists(),
    check(`${applications}userId`, 'Invalid format').isUUID(),
    check(`${applications}ticketName`, 'Invalid').exists(),
    check(`${applications}ticketType`, 'Invalid').exists(),
    check(`${applications}sessionId`, 'Invalid format').isUUID(),
    check(`${applications}dojoId`, 'Invalid format').isUUID(),
    check(`${applications}ticketId`, 'Invalid format').isUUID(),
  ];
}

module.exports.checkApplications = checkApplications;
