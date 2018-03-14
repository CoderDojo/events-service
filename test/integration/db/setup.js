const Knex = require('knex');
const proxy = require('proxyquire');
const fs = require('fs');

const sqlFile = fs.readFileSync(`${__dirname}/events.sql`, 'utf8');
const { knexSnakeCaseMappers, Model } = require('objection');

const createdDbs = [];
const knex = Knex({
  client: 'postgres',
  connection: {
    host: 'db',
    user: 'platform',
    password: 'QdYx3D5y',
    database: 'postgres',
  },
});

before(async () => {
  const name = `events_test_${Date.now()}`;
  await knex.raw(`CREATE DATABASE ${name}`);
  const db = Knex({
    client: 'postgres',
    connection: {
      host: 'db',
      user: 'platform',
      password: 'QdYx3D5y',
      database: name,
    },
    ...knexSnakeCaseMappers(),
  });
  createdDbs.push({
    db,
    name,
  });
  await db.raw(sqlFile);
  await db('cd_events').insert({
    id: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
    dojoId: '6dc83174-aad2-4dac-853f-69a0d738cec8',
    dates: [
      { startTime: '2018-02-28T18:00:00.000Z', endTime: '2018-02-28T19:30:00.000Z' },
    ],
  });
  await db('cd_events').insert({
    id: 'a5d60790-17c4-4a86-a023-d1558b06f118',
    dojoId: '6dc83174-aad2-4dac-853f-69a0d738cec8',
    dates: [
      { startTime: '2018-02-22T13:00:00.000Z', endTime: '2018-02-22T15:00:00.000Z' },
      { startTime: '2018-03-01T13:00:00.000Z', endTime: '2018-03-01T15:00:00.000Z' },
      { startTime: '2018-03-08T13:00:00.000Z', endTime: '2018-03-08T15:00:00.000Z' },
      { startTime: '2018-03-15T13:00:00.000Z', endTime: '2018-03-15T15:00:00.000Z' },
    ],
  });
  await db('cd_events').insert({
    id: '3ae8fc05-55b6-4ea1-ad85-4f385452f764',
    dojoId: '95b351c7-8228-4a9d-8fcc-b6b8bf2dd0c2',
    dates: [
      { startTime: '2018-04-25T10:00:00.000Z', endTime: '2018-04-25T12:00:00.000Z' },
    ],
  });
  await db('cd_events').insert({
    id: '0e83d8e7-b991-4e4e-b3bd-36aa956f6754',
    dojoId: '95b351c7-8228-4a9d-8fcc-b6b8bf2dd0c2',
    dates: [
      { startTime: '2018-05-02T10:00:00.000Z', endTime: '2018-05-02T12:00:00.000Z' },
    ],
  });
  await db('cd_events').insert({
    id: '84c0310e-49ff-4607-99da-a5abb9fb5641',
    dojoId: '95b351c7-8228-4a9d-8fcc-b6b8bf2dd0c2',
    dates: [
      { startTime: '2018-05-09T10:00:00.000Z', endTime: '2018-05-09T12:00:00.000Z' },
    ],
  });
  await db('cd_events').insert({
    id: 'bcef18f8-b5ff-43a9-bc2c-7109f6e5dc20',
    dojoId: '95b351c7-8228-4a9d-8fcc-b6b8bf2dd0c2',
    dates: [
      { startTime: '2018-05-16T10:00:00.000Z', endTime: '2018-05-16T12:00:00.000Z' },
    ],
  });
  await db('cd_events').insert({
    id: '072658b7-cabd-4e31-959b-756b65dec760',
    dojoId: '95b351c7-8228-4a9d-8fcc-b6b8bf2dd0c2',
    dates: [
      { startTime: '2018-05-23T10:00:00.000Z', endTime: '2018-05-23T12:00:00.000Z' },
    ],
  });

  global.app = proxy('../../../index', {
    './setup-db': () => {
      Model.knex(db);
    },
  });
});

after(() => {
  const deletePromises = [];
  createdDbs.forEach((db) => {
    deletePromises.push(async () => {
      await db.db.destroy();
      await knex.raw(`DROP DATABASE ${db.name}`);
    });
  });
  return Promise.all(deletePromises);
});
