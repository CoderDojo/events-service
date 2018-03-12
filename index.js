const express = require('express');
const bodyParser = require('body-parser');
const events = require('./events/routes');
const sessions = require('./sessions/routes');
const setupDb = require('./setup-db');

setupDb();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/events', events);
app.use('/sessions', sessions);
app.get('/ping', (req, res) => res.send(204));

app.listen(3000, () => console.log('event-service listening on port 3000'));

module.exports = app;
