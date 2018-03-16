const newrelic = require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./util/pino-stream');
const events = require('./events/routes');
const sessions = require('./sessions/routes');
const tickets = require('./tickets/routes');
const setupDb = require('./setup-db');

setupDb();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

process.on('unhandledRejection', logger.error);
process.on('uncaughtException', logger.error);
app.use((err, req, res, next) => {
  logger.error(err);
  next();
});

app.use('/events', events);
app.use('/sessions', sessions);
app.use('/tickets', tickets);
app.get('/ping', (req, res) => res.send(204));

app.listen(3000, () => logger.info('event-service listening on port 3000'));

module.exports = app;
