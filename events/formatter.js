const ics = require('ics');

module.exports = function (req, res) {
  let events = [];
  return res.format({
    'text/calendar': () => {
      if (Array.isArray(res.locals.result)) {
        events = res.locals.result;
      } else {
        events = [res.locals.result];
      }
      const icsEvents = events.map(e => ({
        title: e.name,
        description: e.description,
        uid: e.id,
        lastModified: e.updatedAt,
        organizer: { name: 'CoderDojo', email: 'info@coderdojo.com' },
        start: [
          e.startTime.getUTCFullYear(),
          e.startTime.getUTCMonth(),
          e.startTime.getUTCDate(),
          e.startTime.getUTCHours(),
          e.startTime.getUTCMinutes(),
          e.startTime.getUTCSeconds(),
        ],
        end: [
          e.endTime.getUTCFullYear(),
          e.endTime.getUTCMonth(),
          e.endTime.getUTCDate(),
          e.endTime.getUTCHours(),
          e.endTime.getUTCMinutes(),
          e.endTime.getUTCSeconds(),
        ],
        // TODO: migrate to a class if we're handling all those cases
        // TODO: Add applications if they are loaded
        // TODO: Add status of the even depending on the applications
        url: `https://zen.coderdojo.com/events/${e.id}`,
      }));
      res.send(ics.createEvents(icsEvents).value);
    },
    'application/json': () => {
      res.send(res.locals.result);
    },
  });
};
