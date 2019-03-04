const ics = require('ics');

// TODO: migrate to a class if we're handling all those cases
function toICS(result) {
  let events = [];
  if (result.results) {
    events = result.results;
  } else {
    events = [result];
  }
  const icsEvents = events.map(e => ({
    title: e.name,
    description: e.description,
    uid: e.id,
    lastModified: e.updatedAt,
    organizer: { name: 'CoderDojo', email: 'info@coderdojo.com' },
    start: [
      e.startTime.getUTCFullYear(),
      e.startTime.getUTCMonth() + 1,
      e.startTime.getUTCDate(),
      e.startTime.getUTCHours(),
      e.startTime.getUTCMinutes(),
      e.startTime.getUTCSeconds(),
    ],
    end: [
      e.endTime.getUTCFullYear(),
      e.endTime.getUTCMonth() + 1,
      e.endTime.getUTCDate(),
      e.endTime.getUTCHours(),
      e.endTime.getUTCMinutes(),
      e.endTime.getUTCSeconds(),
    ],
    // TODO: Add applications if they are loaded
    // TODO: Add status of the even depending on the applications
    url: `${process.env.ICS_EVENT_URL}${e.id}.ics`,
  }));
  return ics.createEvents(icsEvents).value;
}
module.exports.format = function format(req, res) {
  let response;
  res.format({
    'text/calendar': () => {
      response = toICS(res.locals.result);
    },
    'application/json': () => {
      response = res.locals.result;
    },
  });
  return res.send(response);
};

module.exports.toICS = toICS;
