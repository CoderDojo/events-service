const express = require('express');
const validationsList = require('./validations/list');
const handlersList = require('./handlers/list');
const validationsCheckin = require('./validations/checkin');
const handlersCheckin = require('./handlers/checkin');

const validations = {
  list: validationsList,
  checkin: validationsCheckin,
};
const handlers = {
  list: handlersList,
  checkin: handlersCheckin,
};

const router = express.Router();
router.get('/', validations.list, handlers.list);
router.patch('/checkin', validations.checkin, handlers.checkin);

module.exports = router;
