const express = require('express');
const validationsList = require('./validations/list');
const validationsLoad = require('./validations/load');
const validationsCreate = require('./validations/create');
const handlersList = require('./handlers/list');
const handlersLoad = require('./handlers/load');
const handlersCreate = require('./handlers/create');

const validations = {
  list: validationsList,
  load: validationsLoad,
  create: validationsCreate,
};
const handlers = {
  list: handlersList,
  load: handlersLoad,
  create: handlersCreate,
};

const router = express.Router();
router.get('/:eventId', validations.load, handlers.load);
router.get('/', validations.list, handlers.list);
router.post('/', validations.create, handlers.create);

module.exports = router;
