const ics = require('ics');


// TODO: migrate to a class if we're handling all those cases
function toICS(result) {
  let returned = `BEGIN:VCALENDAR\r
VERSION:2.0\r
CALSCALE:GREGORIAN\r
PRODID:coderdojo/zen\r
METHOD:PUBLISH\r
X-PUBLISHED-TTL:PT1H\r
END:VCALENDAR`;
  let events = [];
  if (result.results) {
    events = result.results;
  } else {
    events = [result];
  }
  if (events.length > 0) {
    const icsEvents = events.map((e) => {
      const eventUrl = e.eventbriteId ? e.eventbriteUrl : `${process.env.EVENT_URL}${e.id}`;
      const icsed = {
        title: e.name,
        description: `${eventUrl}\n ${e.description}`,
        uid: `${e.id}@coderdojo.com`,
        lastModified: e.updatedAt,
        location: e.address,
        productId: 'coderdojo/zen',
        organizer: { name: 'CoderDojo', email: 'info@coderdojo.com' },
        startType: 'local',
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
      };
      if (e.position && e.position.lat && e.position.lon) {
        const { lat, lon } = e.position;
        icsed.geo = { lat, lon };
      }
      return icsed;
    });
    returned = (ics.createEvents(icsEvents)).value;
  }
  return returned;
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
