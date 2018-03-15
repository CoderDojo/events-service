const pg = require('pg'); // eslint-disable-line import/newline-after-import
pg.types.setTypeParser(20, 'text', parseInt);
// See https://github.com/brianc/node-postgres/pull/353#issuecomment-19117695 for more

const Knex = require('knex');
const { knexSnakeCaseMappers, Model } = require('objection');
const dbConfig = require('./config/db.json');

module.exports = () => {
  const knex = Knex(Object.assign(dbConfig, { ...knexSnakeCaseMappers() }));
  Model.knex(knex);
};
