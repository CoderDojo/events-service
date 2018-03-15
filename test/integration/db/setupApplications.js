const fs = require('fs');

module.exports = async (db) => {
  const sqlFile = fs.readFileSync(`${__dirname}/applications.sql`, 'utf8');
  await db.raw(sqlFile);
  await db('cd_applications').insert({
    id: '7cc4f1ba-4cfa-47cd-b769-d5bfafc5d582',
    eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
    name: 'Scooby doo',
    date_of_birth: '2017-10-01',
    status: 'approved',
    user_id: '575fefc6-e9c2-44c8-8e2a-0e1933e6b42e',
    ticket_name: 'Scratch',
    ticket_type: 'ninja',
    session_id: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
    created: new Date(),
    deleted: 0,
    attendance: [],
    dojo_id: '6dc83174-aad2-4dac-853f-69a0d738cec',
    ticket_id: '58544293-9d1e-4ae0-b061-e005225886b2',
    notes: '',
  });
  await db('cd_applications').insert({
    id: '7af9e496-0acd-4f5f-bcfd-2de650ddd48b',
    eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
    name: 'Scrappy doo',
    date_of_birth: '2017-10-01',
    status: 'pending',
    user_id: '575fefc6-e9c2-44c8-8e2a-0e1933e6b42e',
    ticket_name: 'Scratch',
    ticket_type: 'ninja',
    session_id: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
    created: new Date(),
    deleted: 0,
    attendance: [],
    dojo_id: '6dc83174-aad2-4dac-853f-69a0d738cec',
    ticket_id: '58544293-9d1e-4ae0-b061-e005225886b2',
    notes: '',
  });
  await db('cd_applications').insert({
    id: 'e5993df8-8b3b-4f78-a9e7-77bf12470b98',
    eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
    name: 'IM BATMAN',
    date_of_birth: '2017-10-01',
    status: 'approved',
    user_id: '575fefc6-e9c2-44c8-8e2a-0e1933e6b42e',
    ticket_name: 'Scratch',
    ticket_type: 'ninja',
    session_id: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
    created: new Date(),
    deleted: 1,
    attendance: [],
    dojo_id: '6dc83174-aad2-4dac-853f-69a0d738cec',
    ticket_id: '58544293-9d1e-4ae0-b061-e005225886b2',
    notes: '',
  });
  await db('cd_applications').insert({
    id: '99943208-7561-4c90-8701-fcc63f49ea5d',
    eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
    name: 'Its me Mario',
    date_of_birth: '2017-10-01',
    status: 'approved',
    user_id: '575fefc6-e9c2-44c8-8e2a-0e1933e6b42e',
    ticket_name: 'Scratch',
    ticket_type: 'ninja',
    session_id: '29e7aed3-09b6-44cd-a5be-58a8d41ee61f',
    created: new Date(),
    deleted: 0,
    attendance: [],
    dojo_id: '6dc83174-aad2-4dac-853f-69a0d738cec',
    ticket_id: 'e91533b2-94e7-459c-98fe-a4d95fdc9637',
    notes: '',
  });
};
