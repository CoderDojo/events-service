const fs = require('fs');

module.exports = async (db) => {
  const sqlFile = fs.readFileSync(`${__dirname}/sessions.sql`, 'utf8');
  await db.raw(sqlFile);
  await db('cd_sessions').insert({
    id: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
    eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
    name: 'Scratch',
    description: 'just a description',
    status: 'active',
  });
  await db('cd_sessions').insert({
    id: '29e7aed3-09b6-44cd-a5be-58a8d41ee61f',
    eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
    name: 'Web',
    description: 'just a description',
    status: 'active',
  });
  await db('cd_sessions').insert({
    id: '0af25c86-b09f-4f71-9a88-dbcb051ab4a0',
    eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
    name: 'Scratch',
    description: 'just a description',
    status: 'cancelled',
  });
};
