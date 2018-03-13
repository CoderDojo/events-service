const Knex = require('knex');
const { knexSnakeCaseMappers, Model } = require('objection');
const dbConfig = require('./config/db.json');

module.exports = () => {
  const knex = Knex(Object.assign(dbConfig, { ...knexSnakeCaseMappers() }));
  Model.knex(knex);
};
