const Knex = require('knex');
const proxy = require('proxyquire');
const setupEvents = require('./setupEvents');
const setupSessions = require('./setupSessions');
const setupTickets = require('./setupTickets');
const setupApplications = require('./setupApplications');
const setupOrders = require('./setupOrders');

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
  await setupEvents(db);
  await setupSessions(db);
  await setupTickets(db);
  await setupApplications(db);
  await setupOrders(db);

  global.app = proxy('../../../index', {
    './setup-db': () => {
      Model.knex(db);
    },
  });
});

after(() => {
  const deletePromises = [];
  createdDbs.forEach((db) => {
    deletePromises.push((async () => {
      await db.db.destroy();
      await knex.raw(`DROP DATABASE ${db.name}`);
    })());
  });
  return Promise.all(deletePromises);
});
