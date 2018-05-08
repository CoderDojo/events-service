const { body, oneOf } = require('express-validator/check');
// const ValidationHelper = require('../../util/ValidationHelper');

function checkApplications(msg, value) {
  oneOf([
    body('applications.*.name', 'Invalid format').isUUID(),
  ]);

  // return new Promise((req, res, next) => {
  //   try {
  //     validationResult(req).throw();
  //     // yay! we're good to start selling our skilled services :)))
  //     // res.json(...);
  //   } catch (err) {
  //     // Oh noes. This user doesn't have enough skills for this...
  //     res.status(400);
  //   }
  // });

  // ValidationHelper.handleErrors();
}

module.exports.checkApplications = checkApplications;

// module.exports = [
//   oneOf([
//     check(applications.concat('id'), 'Invalid format').isUUID(),
//     check(applications.concat('eventId'), 'Invalid format').isUUID(),
//     check(applications.concat('name'), 'Invalid').exists(),
//     check(applications.concat('dateOfBirth'), 'Invalid').exists(),
//     check(applications.concat('status'), 'Invalid').exists(),
//     check(applications.concat('userId'), 'Invalid format').isUUID(),
//     check(applications.concat('ticketName'), 'Invalid').exists(),
//     check(applications.concat('ticketType'), 'Invalid').exists(),
//     check(applications.concat('sessionId'), 'Invalid format').isUUID(),
//     check(applications.concat('dojoId'), 'Invalid format').isUUID(),
//     check(applications.concat('ticketId'), 'Invalid format').isUUID(),
//   ]),
//   ValidationHelper.handleErrors,
// ];
