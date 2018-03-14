const fs = require('fs');

module.exports = async (db) => {
  const sqlFile = fs.readFileSync(`${__dirname}/tickets.sql`, 'utf8');
  await db.raw(sqlFile);
  await db('cd_tickets').insert({
    id: 'ec5037c5-9e09-47b4-bfaf-dcc66892ba1c',
    session_id: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
    name: 'Scratch',
    type: 'mentor',
    quantity: 5,
    deleted: 0,
    invites: [],
  });
  await db('cd_tickets').insert({
    id: '58544293-9d1e-4ae0-b061-e005225886b2',
    session_id: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
    name: 'Scratch',
    type: 'ninja',
    quantity: 42,
    deleted: 0,
    invites: [],
  });
  await db('cd_tickets').insert({
    id: 'e91533b2-94e7-459c-98fe-a4d95fdc9637',
    session_id: '29e7aed3-09b6-44cd-a5be-58a8d41ee61f',
    name: 'Web',
    type: 'ninja',
    quantity: 42,
    deleted: 0,
    invites: [],
  });
};
