const express = require('express');
const bodyParser = require('body-parser');
const Knex = require('knex');
const { knexSnakeCaseMappers, Model } = require('objection');


const dbConfig = require('./config/db.json')
const events = require('./events/routes');

const app = express();
const router = express.Router();
const knex = Knex(Object.assign(dbConfig, { ...knexSnakeCaseMappers() }));
Model.knex(knex);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/events', events);
app.get('/ping', (req, res) => res.send(204));

app.listen(3000, () => console.log('event-service listening on port 3000'));
