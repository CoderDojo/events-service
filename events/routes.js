const express = require('express');
const validationsList = require('./validations/list');
const validationsLoad = require('./validations/load');
const handlersList = require('./handlers/list');
const handlersLoad = require('./handlers/load');

const validations = {
  list: validationsList,
  load: validationsLoad,
};
const handlers = {
  list: handlersList,
  load: handlersLoad,
};

const router = express.Router();
router.get('/:eventId', validations.load, handlers.load);
router.get('/', validations.list, handlers.list);

module.exports = router;
